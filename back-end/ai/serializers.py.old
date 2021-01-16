"""
    This module contains serializers
"""

from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Group, Ticket, Operator, Account, Client


class ClientSerializer(serializers.HyperlinkedModelSerializer):
    """
        Client serializer
    """
    class Meta:
        model = Client
        fields = "__all__"

    def create(self, validated_data):
        user = User(**validated_data)
        # Hash the user's password.
        user.set_password(validated_data['password'])
        user.save()
        client = Client(user)
        client.save()
        return client


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    """
        Group serializer
    """
    class Meta:
        model = Group
        fields = ('description', )


class TicketSerializer(serializers.HyperlinkedModelSerializer):
    """
        Ticket serializer
    """
    class Meta:
        model = Ticket
        fields = ('title', 'description', 'status', 'group')


class OperatorSerializer(serializers.HyperlinkedModelSerializer):
    """
        Operator serializer
    """
    class Meta:
        model = Operator
        fields = '__all__'


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    """
        Account serializer
    """
    class Meta:
        model = Account
        fields = '__all__'
