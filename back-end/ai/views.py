"""
    Views module
"""

from django.contrib.auth import authenticate, login, logout as auth_logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Ticket, Group, Operator, Account, Client
# from .serializers import TicketSerializer, GroupSerializer, OperatorSerializer, AccountSerializer, ClientSerializer


@csrf_exempt
@api_view(['POST'])
def signup(request):
    """
        Allow signups for clients
    """

    try:
        user = User.objects.create_user(username=request.data["username"],
                                     password=request.data["password"])
        user.save()
        acc = Account(user=user, username=request.data["username"])
        acc.save()
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_201_CREATED)


@api_view(['POST'])
def auth(request):
    """
        Allow login for users
    """

    user = authenticate(username=request.data["username"],
                        password=request.data["password"])
    if user is not None:
        login(request, user)
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@login_required
@api_view(['GET'])
def logout(request):
    """
        Allow logout for users
    """
    auth_logout(request)


@login_required
#  @user_passes_test(lambda u: u.is_superuser)
@api_view(['POST'])
def add_operator(request):
    """
        Let admins add operator
    """
    try:
        user = User.objects.create_user(username=request.data["username"],
                                     password=request.data["password"])

        #  password=request.data["password"])
        user.save()
        acc = Account(user=user, username=request.data["username"])
        acc.save()
        operator = Operator(account=acc, group=None)
        operator.save()
    except Exception as e:
        print(e)
        print(request.data)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_201_CREATED)


@api_view(['POST'])
def add_client(request):
    """
        Let client register
    """

    try:
        user = User.objects.create_user(username=request.data["username"],
                                     password=request.data["password"])

        user.save()
        acc = Account(user=user, username=request.data["username"])
        acc.save()
        client = Client(account_id=acc)
        client.save()
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
    """
        Let admins add group
    """

    try:
        group = Group.objects.create(description=request.data["description"])
        group.save()
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_201_CREATED)


@login_required
@user_passes_test(lambda u: u.is_superuser)
@api_view(['GET', 'PUT', 'DELETE'])
def handle_group(request, pk):
    """
        Handle group endpoints:
            - Get: get a group with id = pk
            - Put: create a group
            - Delete: remove a group
    """

    if request.method == 'GET':
        try:
            operator = model_to_dict(Group.objects.get(pk=pk))
            return Response(operator)
        except Group.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'PUT':
        try:
            Group.objects.filter(pk=pk).update(
                description=request.data["description"])
        except Group.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'DELETE':
        try:
            group = Group.objects.get(pk=pk)
            group.delete()
        except Group.DoesNotExist as ex:
            raise Http404 from ex

    return Response(status=status.HTTP_200_OK)


@login_required
#  @user_passes_test(lambda u: u.is_superuser)
@api_view(['GET', 'PUT', 'DELETE'])
def handle_operator(request, pk):
    """
        Handle operator endpoints:
            - Get: get an operator with id = pk
            - Put: create an operator
            - Delete: remove an operator
    """

    if request.method == 'GET':
        try:
            operator = model_to_dict(Operator.objects.get(pk=pk))
            operator["account"] = model_to_dict(Operator.objects.get(pk=pk).account)
            return Response(operator)
        except Operator.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'PUT':
        print(request.data)
        try:
            Operator.objects.filter(pk=pk).update(group=request.data["group"])
            Account.objects.filter(pk=request.data["account"]["id"]).update(
                email=request.data["account"]["email"])
        except Operator.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'DELETE':
        try:
            operator = Operator.objects.get(pk=pk)
            operator.delete()
        except Operator.DoesNotExist as ex:
            raise Http404 from ex

    return Response(status=status.HTTP_200_OK)


@login_required
@api_view(['GET', 'PUT', 'DELETE'])
def handle_client(request, pk):
    """
        Handle clients endpoints:
            - Get: get a client with id = pk
            - Put: create a client
            - Delete: remove a client
    """

    if request.method == 'GET':
        try:
            client = model_to_dict(Client.objects.get(pk=pk))
            client["account_id"] = model_to_dict(
                Client.objects.get(pk=pk).account_id)
            #  cl["account_id"]["user"] = model_to_dict(
            #      Client.objects.get(pk=pk).account_id.user)
            #  print(cl)

            return Response(client)
        except Client.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'PUT':
        try:
            #  Client.objects.filter(pk=pk).update(
            #      account_id=request.data["account_id"])
            Account.objects.filter(pk=request.data["account_id"]["id"]).update(
                email=request.data["account_id"]["email"])
        except Client.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'DELETE':
        try:
            client = Client.objects.get(pk=pk)
            client.delete()
        except Client.DoesNotExist as ex:
            raise Http404 from ex

    return Response(status=status.HTTP_200_OK)
