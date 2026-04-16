from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Category, Market, Trade
from .serializers import (
    CategorySerializer, MarketSerializer,
    TradeSerializer,
)
from .permissions import IsModeratorOrAdmin, is_moderator_or_admin


# ---- Function-Based Views (2 required) ----

@api_view(['GET', 'POST'])
def trade_list_create(request):
    if request.method == 'GET':
        market_id = request.query_params.get('market_id')
        trades = Trade.objects.all().order_by('-created_at')
        if market_id:
            trades = trades.filter(market_id=market_id)
        serializer = TradeSerializer(trades, many=True)
        return Response(serializer.data)

    serializer = TradeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---- Class-Based Views (2 required) ----

class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MarketListCreateView(APIView):
    def get(self, request):
        category_id = request.query_params.get('category_id')
        active_only = request.query_params.get('active')

        if active_only is None or active_only.lower() in ['true', '1', 'yes']:
            markets = Market.active.all()
        elif request.user.is_authenticated and request.user.is_staff:
            markets = Market.objects.all()
        else:
            markets = Market.active.all()

        if category_id:
            markets = markets.filter(category_id=category_id)

        markets = markets.order_by('-created_at')
        serializer = MarketSerializer(markets, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MarketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PendingMarketListView(APIView):
    permission_classes = [IsAuthenticated, IsModeratorOrAdmin]

    def get(self, request):
        markets = Market.objects.filter(approved=False).order_by('-created_at')
        serializer = MarketSerializer(markets, many=True)
        return Response(serializer.data)


class MarketDetailView(APIView):
    def get_object(self, pk):
        try:
            return Market.objects.get(pk=pk)
        except Market.DoesNotExist:
            return None

    def get(self, request, pk):
        market = self.get_object(pk)
        if not market:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not market.approved and not is_moderator_or_admin(request.user):
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = MarketSerializer(market)
        return Response(serializer.data)

    def put(self, request, pk):
        if not is_moderator_or_admin(request.user):
            return Response(status=status.HTTP_403_FORBIDDEN)
        market = self.get_object(pk)
        if not market:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = MarketSerializer(market, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not is_moderator_or_admin(request.user):
            return Response(status=status.HTTP_403_FORBIDDEN)
        market = self.get_object(pk)
        if not market:
            return Response(status=status.HTTP_404_NOT_FOUND)
        market.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MarketApproveView(APIView):
    permission_classes = [IsAuthenticated, IsModeratorOrAdmin]

    def post(self, request, pk):
        try:
            market = Market.objects.get(pk=pk)
        except Market.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        market.approved = True
        market.approved_at = timezone.now()
        market.approved_by = request.user
        market.save()

        serializer = MarketSerializer(market)
        return Response(serializer.data)


class AuthMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_moderator_or_admin': is_moderator_or_admin(user),
        })


class AuthPingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'ok': True})
