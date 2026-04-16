from django.contrib import admin
from .models import Category, Market, Trade


@admin.register(Market)
class MarketAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at', 'approved', 'approved_by', 'approved_at')
    list_filter = ('approved', 'category', 'is_resolved')
    readonly_fields = ('approved_at', 'approved_by')
    search_fields = ('title', 'description')


admin.site.register(Category)
admin.site.register(Trade)
