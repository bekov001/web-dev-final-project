from django.utils import timezone
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Market, Trade, UserProfile


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=4)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken')
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    points = serializers.DecimalField(
        max_digits=12, decimal_places=4, coerce_to_string=False, read_only=True,
    )

    class Meta:
        model = UserProfile
        fields = ['username', 'points']


# serializers.Serializer (2 required)
class TradeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    market = serializers.PrimaryKeyRelatedField(queryset=Market.objects.all())
    trader_name = serializers.CharField(max_length=100, read_only=True)
    choice = serializers.BooleanField()
    price_at_trade = serializers.DecimalField(
        max_digits=5, decimal_places=4, coerce_to_string=False, read_only=True,
    )
    created_at = serializers.DateTimeField(read_only=True)

    def validate_market(self, market):
        if not market.approved:
            raise serializers.ValidationError(
                'This market is pending moderator/admin approval.'
            )
        return market

    def create(self, validated_data):
        return Trade.objects.create(**validated_data)

    def update(self, instance, validated_data):
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
    approved = serializers.BooleanField(read_only=True)
    approved_at = serializers.DateTimeField(read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)
    is_closed = serializers.SerializerMethodField()

    class Meta:
        model = Market
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'created_at', 'end_date', 'is_resolved', 'resolved_outcome',
            'image_url', 'yes_count', 'no_count', 'yes_percentage',
            'approved', 'approved_at', 'approved_by_name', 'is_closed',
        ]

    def get_is_closed(self, obj):
        return obj.end_date <= timezone.now()
