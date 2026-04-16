from django.db import migrations


def create_moderator_group(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.get_or_create(name='moderator')


def remove_moderator_group(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.filter(name='moderator').delete()


class Migration(migrations.Migration):
    dependencies = [
        ('markets', '0003_market_approved_market_approved_at_and_more'),
    ]

    operations = [
        migrations.RunPython(create_moderator_group, remove_moderator_group),
    ]
