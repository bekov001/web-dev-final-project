from django.urls import path
from . import views

urlpatterns = [
    path('auth/ping/', views.AuthPingView.as_view()),
    path('auth/me/', views.AuthMeView.as_view()),
    path('categories/', views.CategoryListView.as_view()),
    path('markets/', views.MarketListCreateView.as_view()),
    path('markets/pending/', views.PendingMarketListView.as_view()),
    path('markets/<int:pk>/', views.MarketDetailView.as_view()),
    path('markets/<int:pk>/approve/', views.MarketApproveView.as_view()),
    path('markets/<int:pk>/reject/', views.MarketRejectView.as_view()),
    path('trades/', views.trade_list_create),
]
