from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    balance = models.FloatField('money balance', default=0)
    is_admin = models.BooleanField('is the user an admin', default=False)

class Category(models.Model):
    name = models.TextField('category name')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class Entry(models.Model):
    name = models.TextField('entry name')
    date = models.DateField('entry date')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.FloatField('entry amount')
    place = models.TextField('where the money went to/came from')
    is_expense = models.BooleanField('is it an expense, or an earning')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
