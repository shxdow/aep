from rest_framework import serializers

from .models import Group, Ticket, Operator, Account


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('description')


class TicketSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ticket
        fields = ('title', 'description', 'status', 'group')


class OperatorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Operator
        fields = ('user', 'group')


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Operator
        fields = ('user', 'group')


class TicketSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ticket
        fields = ('title', 'description', 'status', 'group')
