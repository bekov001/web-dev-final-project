from django.contrib import admin
from .models import Category, Market, Trade

admin.site.register(Category)
admin.site.register(Market)
admin.site.register(Trade)
