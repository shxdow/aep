"""
    This module contains admin register models
"""

from django.contrib import admin
from .models import Group, Ticket, Operator, Account #, Mail

# Register your models here.
admin.site.register(Group)
admin.site.register(Ticket)
admin.site.register(Operator)
admin.site.register(Account)
#  admin.site.register(Mail)
