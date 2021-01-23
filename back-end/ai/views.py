"""
    Views module
"""

import json

from django.contrib.auth import authenticate, login, logout as auth_logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User, Group as DjangoGroup
from django.forms.models import model_to_dict
from django.http import Http404, HttpResponse, QueryDict
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import renderer_classes
from rest_framework.renderers import JSONRenderer

from .models import Ticket, Group, Operator, Account, Client, Comment


@csrf_exempt
def signup(request):
    """
        Allow signups for clients
    """

    try:
        body_unicode = request.body.decode('utf-8')
        request.POST = json.loads(body_unicode)
        user = User.objects.create_user(username=request.POST["username"],
                                        password=request.POST["password"])
        user.save()
        acc = Account(user=user, email=request.POST["username"])
        acc.save()
    except:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return HttpResponse(status=status.HTTP_201_CREATED)


@csrf_exempt
def auth(request):
    """
        Allow login for users
    """

    body_unicode = request.body.decode('utf-8')
    request.POST = json.loads(body_unicode)

    user = authenticate(username=request.POST["username"],
                        password=request.POST["password"])
    if user is not None:
        login(request, user)
        try:
            user_account = user.account
        except:
            user_account = None

        if user_account is None:
            return HttpResponse(status=status.HTTP_200_OK)

        try:
            client = Client.objects.get(account=user.account.id).id
        except:
            client = None

        return HttpResponse({
            'client': client,
            'account': user.account.id,
        })
    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)


@login_required
@renderer_classes(JSONRenderer)
def logout(request):
    """
        Allow logout for users
    """
    auth_logout(request)


@login_required
@renderer_classes(JSONRenderer)
@user_passes_test(lambda u: u.is_superuser)
def add_operator(request):
    """
        Let admins add operator
    """
    try:
        if not request.user.is_superuser:
            return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
        body_unicode = request.body.decode('utf-8')
        request.POST = json.loads(body_unicode)
        user = User.objects.create_user(username=request.POST["username"],
                                        password=request.POST["password"])

        group = DjangoGroup.objects.get_or_create(name="Operator")[0]
        user.groups.add(group)

        user.save()
        acc = Account(user=user, email=request.POST["username"])
        acc.save()
        operator = Operator(account=acc, group=None)
        operator.save()
    except Exception as e:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return HttpResponse(status=status.HTTP_201_CREATED)


def add_client(request):
    """
        Let client register
    """

    try:
        body_unicode = request.body.decode('utf-8')
        request.POST = json.loads(body_unicode)
        user = User.objects.create_user(username=request.POST["username"],
                                        password=request.POST["password"])

        user.save()
        acc = Account(user=user, email=request.POST["username"])
        acc.save()
        client = Client(account=acc)
        client.save()
    except Exception as e:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return HttpResponse(status=status.HTTP_201_CREATED)


@login_required
@renderer_classes(JSONRenderer)
def add_ticket(request):
    """
        Let someone add a ticket
    """
    try:
        body_unicode = request.body.decode('utf-8')
        request.POST = json.loads(body_unicode)
        ticket = Ticket.objects.create(
            title=request.POST["title"],
            description=request.POST["description"],
            client=Client.objects.get(pk=request.POST["client"]))

        ticket.save()
    except Exception as e:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return HttpResponse(status=status.HTTP_201_CREATED)


@login_required
@renderer_classes(JSONRenderer)
def add_comment(request):
    """
        Let someone leave a comment to a ticket
    """
    try:
        body_unicode = request.body.decode('utf-8')
        request.POST = json.loads(body_unicode)
        account = Account.objects.get(pk=request.POST["account"])
        ticket = Ticket.objects.get(pk=request.POST["ticket"])
        comment = Comment.objects.create(timestamp=request.POST["timestamp"],
                                         ticket=ticket,
                                         account=account,
                                         content=request.POST["content"])

        comment.save()
    except Exception as e:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return HttpResponse(status=status.HTTP_201_CREATED)


@login_required
@renderer_classes(JSONRenderer)
def add_group(request):
    """
        Let admins add group
    """

    try:
        body_unicode = request.body.decode('utf-8')
        request.POST = json.loads(body_unicode)
        group = Group.objects.create(description=request.POST["description"])
        group.save()
    except:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return HttpResponse(status=status.HTTP_201_CREATED)


@login_required
@renderer_classes(JSONRenderer)
@user_passes_test(lambda u: u.is_superuser)
def handle_group(request, pk):
    """
        Handle group endpoints:
            - Get: get a group with id = pk
            - Put: create a group
            - Delete: remove a group
    """

    if request.method == 'GET':
        try:
            group = model_to_dict(Group.objects.get(pk=pk))
            return HttpResponse(group)
        except Group.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'PUT':
        try:
            body_unicode = request.body.decode('utf-8')
            request.PUT = json.loads(body_unicode)
            Group.objects.filter(pk=pk).update(
                description=request.PUT["description"])
            return HttpResponse(status=status.HTTP_200_OK)
        except Group.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'DELETE':
        try:
            group = Group.objects.get(pk=pk)
            group.delete()
            return HttpResponse(status=status.HTTP_200_OK)
        except Group.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    else:
        return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@login_required
@renderer_classes(JSONRenderer)
@user_passes_test(lambda u: u.is_superuser)
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
            return HttpResponse(operator)
        except Operator.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'PUT':
        try:
            body_unicode = request.body.decode('utf-8')
            request.PUT = json.loads(body_unicode)
            Operator.objects.filter(pk=pk).update(group=request.PUT["group"])
            Account.objects.filter(pk=request.PUT["account"]["id"]).update(
                email=request.PUT["account"]["email"])
            return HttpResponse(status=status.HTTP_200_OK)
        except Operator.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'DELETE':
        try:
            operator = Operator.objects.get(pk=pk)
            operator.delete()
            return HttpResponse(status=status.HTTP_200_OK)
        except Operator.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    else:
        return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@login_required
@renderer_classes(JSONRenderer)
def handle_comment(request, pk):
    """
        Handle comment endpoints:
            - Get: get a comment with id = pk
    """

    if request.method == 'GET':
        try:
            ticket = model_to_dict(Comment.objects.get(pk=pk))
            return HttpResponse(ticket)
        except Comment.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    else:
        return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@login_required
@renderer_classes(JSONRenderer)
def get_tickets(request):
    """
        Get all tickets in the database
    """
    return HttpResponse(Ticket.objects.all())


@login_required
@renderer_classes(JSONRenderer)
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
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'PUT':
        try:
            if not request.user.groups.filter(name="Operator").exists():
                print(request.user.groups.all())
                return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)

            body_unicode = request.body.decode('utf-8')
            request.PUT = json.loads(body_unicode)
            ticket = Ticket.objects.get(pk=pk)
            ticket.status = request.PUT["status"]
            ticket.save()
            return HttpResponse(status=status.HTTP_200_OK)
        except Client.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    else:
        return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@login_required
@renderer_classes(JSONRenderer)
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
            return HttpResponse(client)
        except Client.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'PUT':
        try:
            body_unicode = request.body.decode('utf-8')
            request.PUT = json.loads(body_unicode)
            Account.objects.filter(pk=request.PUT["account"]["id"]).update(
                email=request.PUT["account"]["email"])
            return HttpResponse(status=status.HTTP_200_OK)
        except Client.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'DELETE':
        try:
            client = Client.objects.get(pk=pk)
            client.delete()
            return HttpResponse(status=status.HTTP_200_OK)
        except Client.DoesNotExist as ex:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    else:
        return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)
