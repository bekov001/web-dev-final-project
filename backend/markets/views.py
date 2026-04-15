from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Category, Market, Trade
from .serializers import (
    CategorySerializer, MarketSerializer,
    TradeSerializer,
)


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

        if active_only:
            markets = Market.active.all()
        else:
            markets = Market.objects.all()

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
        serializer = MarketSerializer(market)
        return Response(serializer.data)

    def put(self, request, pk):
        market = self.get_object(pk)
        if not market:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = MarketSerializer(market, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        market = self.get_object(pk)
        if not market:
            return Response(status=status.HTTP_404_NOT_FOUND)
        market.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
