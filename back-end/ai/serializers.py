from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Group, Ticket, Operator, Account, Client


class ClientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"

    def create(self, validated_data):
        user = User(**validated_data)
        # Hash the user's password.
        user.set_password(validated_data['password'])
        user.save()
        c = Client(user)
        c.save()
        return c


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('description', )


class TicketSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ticket
        fields = ('title', 'description', 'status', 'group')


class OperatorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Operator
        fields = '__all__'


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
