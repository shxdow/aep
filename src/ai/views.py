from django.shortcuts import render
from rest_framework import permissions

from rest_framework import viewsets
from rest_framework.views import APIView
from .models import Ticket, Group, Operator, Account
from .serializers import TicketSerializer, GroupSerializer, OperatorSerializer, AccountSerializer
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404

from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class TicketList(APIView):
    """
    List all snippets, or create a new snippet.
    """

    authentication_classes = [SessionAuthentication, TokenAuthentication]
    #
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        tickets = Ticket.objects.all()
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TicketDetail(APIView):
    """
    Retrieve, update or delete a ticket instance.
    """
    def get_object(self, pk):
        try:
            return Ticket.objects.get(pk=pk)
        except Ticket.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        ticket = self.get_object(pk)
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        ticket = self.get_object(pk)
        serializer = TicketSerializer(ticket, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        ticket = self.get_object(pk)
        ticket.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
