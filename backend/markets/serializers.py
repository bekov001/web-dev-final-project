from rest_framework import serializers
from .models import Category, Market, Trade


# serializers.Serializer (2 required)
class TradeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    market = serializers.PrimaryKeyRelatedField(queryset=Market.objects.all())
    trader_name = serializers.CharField(max_length=100)
    choice = serializers.BooleanField()
    created_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Trade.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.trader_name = validated_data.get('trader_name', instance.trader_name)
        instance.choice = validated_data.get('choice', instance.choice)
        instance.save()
        return instance


# serializers.ModelSerializer (2 required)
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class MarketSerializer(serializers.ModelSerializer):
    yes_count = serializers.IntegerField(read_only=True)
    no_count = serializers.IntegerField(read_only=True)
    yes_percentage = serializers.IntegerField(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Market
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'created_at', 'end_date', 'is_resolved', 'resolved_outcome',
            'image_url', 'yes_count', 'no_count', 'yes_percentage',
        ]
