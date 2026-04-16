from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view()),
    path('markets/', views.MarketListCreateView.as_view()),
    path('markets/<int:pk>/', views.MarketDetailView.as_view()),
    path('trades/', views.trade_list_create),
]
