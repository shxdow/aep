from django.shortcuts import render
import json
from django.core import serializers
from rest_framework import permissions
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from .models import Ticket, Group, Operator, Account, Client
from .serializers import TicketSerializer, GroupSerializer, OperatorSerializer, AccountSerializer, ClientSerializer
from django.http import HttpResponse

from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required, user_passes_test

from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
"""
    Allow signups for clients
"""


@csrf_exempt
@api_view(['POST'])
def signup(request):

    try:
        u = User.objects.create_user(username=request.data["username"],
                                     password=request.data["password"])
        u.save()
        acc = Account(user=u, username=request.data["username"])
        acc.save()
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_201_CREATED)


"""
    Let admins add employees
"""


@api_view(['POST'])
def auth(request):

    user = authenticate(username=request.data["username"],
                        password=request.data["password"])
    if user is not None:
        login(request, user)
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@login_required
@api_view(['GET'])
def logout(request):
    logout(request)


@login_required
#  @user_passes_test(lambda u: u.is_superuser)
@api_view(['POST'])
def add_operator(request):

    try:
        u = User.objects.create_user(username=request.data["username"],
                                     password=request.data["password"])

        #  password=request.data["password"])
        u.save()
        acc = Account(user=u, username=request.data["username"])
        acc.save()
        op = Operator(account=acc, group=None)
        op.save()
    except Exception as e:
        print(e)
        print(request.data)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_201_CREATED)


@api_view(['POST'])
def add_client(request):

    try:
        u = User.objects.create_user(username=request.data["username"],
                                     password=request.data["password"])

        u.save()
        acc = Account(user=u, username=request.data["username"])
        acc.save()
        cl = Client(account_id=acc)
        cl.save()
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_201_CREATED)


#  @login_required
#  @api_view(['POST'])
#  def add_ticket(request):
#
#      try:
#          ticket = User.objects.create_user()
#
#      except:
#          return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#      return Response(status=status.HTTP_201_CREATED)


#  @user_passes_test(lambda u: u.is_superuser)
@login_required
@api_view(['POST'])
def add_group(request):

    try:
        g = Group.objects.create(description=request.data["description"])
        g.save()
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_201_CREATED)


@login_required
@user_passes_test(lambda u: u.is_superuser)
@api_view(['GET', 'PUT', 'DELETE'])
def handle_group(request, pk):

    if request.method == 'GET':
        try:
            op = model_to_dict(Group.objects.get(pk=pk))
            return Response(op)
        except Group.DoesNotExist:
            raise Http404
    elif request.method == 'PUT':
        try:
            Group.objects.filter(pk=pk).update(
                description=request.data["description"])
        except Group.DoesNotExist:
            raise Http404
        return Response(status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        try:
            g = Group.objects.get(pk=pk)
            g.delete()
        except Group.DoesNotExist:
            raise Http404
        return Response(status=status.HTTP_200_OK)


@login_required
#  @user_passes_test(lambda u: u.is_superuser)
@api_view(['GET', 'PUT', 'DELETE'])
def handle_operator(request, pk):

    if request.method == 'GET':
        try:
            op = model_to_dict(Operator.objects.get(pk=pk))
            op["account"] = model_to_dict(Operator.objects.get(pk=pk).account)
            return Response(op)
        except Operator.DoesNotExist:
            raise Http404
    elif request.method == 'PUT':
        print(request.data)
        try:
            Operator.objects.filter(pk=pk).update(group=request.data["group"])
            Account.objects.filter(pk=request.data["account"]["id"]).update(
                email=request.data["account"]["email"])
        except Operator.DoesNotExist:
            raise Http404
        return Response(status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        try:
            op = Operator.objects.get(pk=pk)
            op.delete()
        except Operator.DoesNotExist:
            raise Http404
        return Response(status=status.HTTP_200_OK)


@login_required
@api_view(['GET', 'PUT', 'DELETE'])
def handle_client(request, pk):

    if request.method == 'GET':
        try:
            cl = model_to_dict(Client.objects.get(pk=pk))
            cl["account_id"] = model_to_dict(
                Client.objects.get(pk=pk).account_id)
            #  cl["account_id"]["user"] = model_to_dict(
            #      Client.objects.get(pk=pk).account_id.user)
            #  print(cl)

            return Response(cl)
        except Client.DoesNotExist:
            raise Http404
    elif request.method == 'PUT':
        try:
            #  Client.objects.filter(pk=pk).update(
            #      account_id=request.data["account_id"])
            Account.objects.filter(pk=request.data["account_id"]["id"]).update(
                email=request.data["account_id"]["email"])
        except Client.DoesNotExist:
            raise Http404
        return Response(status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        try:
            cl = Client.objects.get(pk=pk)
            cl.delete()
        except Client.DoesNotExist:
            raise Http404
        return Response(status=status.HTTP_200_OK)
