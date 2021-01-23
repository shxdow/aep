"""
    Views module
"""

from django.contrib.auth import authenticate, login, logout as auth_logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.contrib import auth
from django.forms.models import model_to_dict
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Ticket, Group, Operator, Account, Client, Comment


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
        acc = Account(user=user, email=request.data["username"])
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
        try:
            user_account = user.account
        except:
            user_account = None

        if user_account is None:
            return Response(status=status.HTTP_200_OK)

        try:
            client = Client.objects.get(account=user.account.id).id
        except:
            client = None

        return Response({
            'client': client,
            'account': user.account.id,
        })
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
        acc = Account.objects.get(user__username=request.user.username)
        if Operator.objects.filter(account=acc) is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        user = User.objects.create_user(username=request.data["username"],
                                        password=request.data["password"])

        group = auth.models.Group.objects.get_or_create(name="Operator")
        user.groups.add(group)

        user.save()
        acc = Account(user=user, email=request.data["username"])
        acc.save()
        operator = Operator(account=acc, group=None)
        operator.save()
    except Exception as e:
        print(e)
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
        acc = Account(user=user, email=request.data["username"])
        acc.save()
        client = Client(account=acc)
        client.save()
    except Exception as e:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_201_CREATED)


@login_required
@api_view(['POST'])
def add_ticket(request):
    """
        Let someone add a ticket
    """
    try:
        ticket = Ticket.objects.create(title=request.data["title"],
                                       description=request.data["description"],
                                       client=Client.objects.get(pk=request.data["client"]))

        ticket.save()
    except Exception as e:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_201_CREATED)


@login_required
@api_view(['POST'])
def add_comment(request):
    """
        Let someone leave a comment to a ticket
    """
    try:
        account = Account.objects.get(pk=request.data["account"])
        ticket = Ticket.objects.get(pk=request.data["ticket"])
        comment = Comment.objects.create(timestamp=request.data["timestamp"],
                                         ticket=ticket,
                                         account=account,
                                         content=request.data["content"])

        comment.save()
    except Exception as e:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_201_CREATED)


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
#  @user_passes_test(lambda u: u.is_superuser)
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
            return Response(status=status.HTTP_200_OK)
        except Group.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'DELETE':
        try:
            group = Group.objects.get(pk=pk)
            group.delete()
            return Response(status=status.HTTP_200_OK)
        except Group.DoesNotExist as ex:
            raise Http404 from ex


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
            operator["account"] = model_to_dict(
                Operator.objects.get(pk=pk).account)
            return Response(operator)
        except Operator.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'PUT':
        try:
            Operator.objects.filter(pk=pk).update(group=request.data["group"])
            Account.objects.filter(pk=request.data["account"]["id"]).update(
                email=request.data["account"]["email"])
            return Response(status=status.HTTP_200_OK)
        except Operator.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'DELETE':
        try:
            operator = Operator.objects.get(pk=pk)
            operator.delete()
            return Response(status=status.HTTP_200_OK)
        except Operator.DoesNotExist as ex:
            raise Http404 from ex


@login_required
@api_view(['GET'])
def handle_comment(request, pk):
    """
        Handle comment endpoints:
            - Get: get a comment with id = pk
    """

    if request.method == 'GET':
        try:
            ticket = model_to_dict(Comment.objects.get(pk=pk))
            return Response(ticket)
        except Comment.DoesNotExist as ex:
            raise Http404 from ex
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@login_required
@api_view(['GET'])
def get_tickets(request):
    """
        Get all tickets in the database
    """
    return Response(list(map(model_to_dict, Ticket.objects.all())))


@login_required
@api_view(['GET', 'PUT'])
def handle_ticket(request, pk):
    """
        Handle ticket endpoints:
            - Get: get a ticket with id = pk
    """

    if request.method == 'GET':
        try:
            ticket = model_to_dict(Ticket.objects.get(pk=pk))

            comments = list(
                map(model_to_dict, Comment.objects.filter(ticket=pk)))
            for c in comments:
                c['account'] = model_to_dict(
                    Account.objects.get(pk=c['account']))['name']

            return Response({
                'title': ticket['title'],
                'description': ticket['description'],
                'status': ticket['status'],
                'group': ticket['group'],
                'comments': comments,
            })
        except Ticket.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'PUT':
        try:
            if not request.user.groups.filter(name="Operator").exists():
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            ticket = Ticket.objects.get(pk=pk)
            ticket.status = request.data["status"]
            ticket.save()
            return Response(status=status.HTTP_200_OK)
        except Client.DoesNotExist as ex:
            raise Http404 from ex
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


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
            client["account"] = model_to_dict(
                Client.objects.get(pk=pk).account)
            return Response(client)
        except Client.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'PUT':
        try:
            Account.objects.filter(pk=request.data["account"]["id"]).update(
                email=request.data["account"]["email"])
            return Response(status=status.HTTP_200_OK)
        except Client.DoesNotExist as ex:
            raise Http404 from ex
    elif request.method == 'DELETE':
        try:
            client = Client.objects.get(pk=pk)
            client.delete()
            return Response(status=status.HTTP_200_OK)
        except Client.DoesNotExist as ex:
            raise Http404 from ex
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
