from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.register_view),
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/me/', views.me_view),

    # App
    path('categories/', views.CategoryListView.as_view()),
    path('markets/', views.MarketListCreateView.as_view()),
    path('markets/pending/', views.PendingMarketListView.as_view()),
    path('markets/<int:pk>/', views.MarketDetailView.as_view()),
    path('markets/<int:pk>/approve/', views.MarketApproveView.as_view()),
    path('markets/<int:pk>/reject/', views.MarketRejectView.as_view()),
    path('trades/', views.trade_list_create),
]
