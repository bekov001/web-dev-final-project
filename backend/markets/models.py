from django.db import models


class ActiveMarketManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_resolved=False)


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='📊')

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Market(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='markets')
    created_at = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    is_resolved = models.BooleanField(default=False)
    resolved_outcome = models.BooleanField(null=True, blank=True)
    image_url = models.URLField(blank=True)

    objects = models.Manager()
    active = ActiveMarketManager()

    def __str__(self):
        return self.title

    @property
    def yes_count(self):
        return self.trades.filter(choice=True).count()

    @property
    def no_count(self):
        return self.trades.filter(choice=False).count()

    @property
    def yes_percentage(self):
        total = self.yes_count + self.no_count
        if total == 0:
            return 50
        return round(self.yes_count / total * 100)


class Trade(models.Model):
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='trades')
    trader_name = models.CharField(max_length=100)
    choice = models.BooleanField()  # True = Yes, False = No
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        side = 'YES' if self.choice else 'NO'
        return f'{self.trader_name} -> {side} on "{self.market.title}"'
