import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from datetime import timedelta
from markets.models import Category, Market, Trade

Category.objects.all().delete()

categories = [
    Category(name='Politics', description='Political events and elections', icon='🏛️'),
    Category(name='Crypto', description='Cryptocurrency predictions', icon='₿'),
    Category(name='Sports', description='Sports outcomes', icon='⚽'),
    Category(name='Tech', description='Technology predictions', icon='💻'),
    Category(name='Science', description='Scientific breakthroughs', icon='🔬'),
]
Category.objects.bulk_create(categories)
cats = {c.name: c for c in Category.objects.all()}

now = timezone.now()
markets_data = [
    ('Will Bitcoin exceed $200k by end of 2026?', 'Bitcoin has been on a bull run. Will it break 200k?', cats['Crypto'], now + timedelta(days=260)),
    ('Will SpaceX land humans on Mars by 2030?', 'Elon Musk has promised Mars missions. Will it happen?', cats['Science'], now + timedelta(days=1400)),
    ('Will AI pass the Turing test convincingly by 2027?', 'With rapid LLM advancements, will AI fool humans?', cats['Tech'], now + timedelta(days=620)),
    ('Will Kazakhstan win a gold medal at 2028 Olympics?', 'Kazakhstan athletes have been training hard.', cats['Sports'], now + timedelta(days=800)),
    ('Will the US hold presidential elections in 2028?', 'Standard election cycle question.', cats['Politics'], now + timedelta(days=950)),
    ('Will Ethereum flip Bitcoin in market cap?', 'The flippening debate continues.', cats['Crypto'], now + timedelta(days=365)),
    ('Will Apple release AR glasses in 2026?', 'Rumors of Apple AR glasses have been circulating.', cats['Tech'], now + timedelta(days=260)),
    ('Will Real Madrid win Champions League 2026?', 'Real Madrid is always a contender.', cats['Sports'], now + timedelta(days=60)),
]

for title, desc, cat, end in markets_data:
    m = Market.objects.create(title=title, description=desc, category=cat, end_date=end)
    # Add some trades
    for name, choice in [('Alice', True), ('Bob', False), ('Charlie', True), ('Diana', True), ('Eve', False)]:
        Trade.objects.create(market=m, trader_name=name, choice=choice)
    

print(f'Seeded {Category.objects.count()} categories, {Market.objects.count()} markets, {Trade.objects.count()} trades')
