"""
    Views module
"""

import json
from .ticketclassifier import increment, extract_words, max_in_dict, weight_update, assign_group_to_ticket, K1, K2, K3, estimate_time

from django.contrib.auth import authenticate, login, logout as auth_logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User, Group as DjangoGroup
from django.forms.models import model_to_dict
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import renderer_classes
from rest_framework.renderers import JSONRenderer

from .models import Ticket, Group, Operator, Account, Client, Comment


def decode_json_body(request):
    """
        Decode the JSON-formatted body of a request
    """
    return json.loads(request.body.decode('utf-8'))


@csrf_exempt
def signup(request):
    """
        Allow signups for clients
    """

    try:
        request.POST = decode_json_body(request)
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

    request.POST = decode_json_body(request)
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

        return JsonResponse({
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
        request.POST = decode_json_body(request)
        user = User.objects.create_user(username=request.POST["username"],
                                        password=request.POST["password"])

        group = DjangoGroup.objects.get_or_create(name="Operator")[0]
        user.groups.add(group)

        user.save()
        acc = Account(user=user, email=request.POST["username"])
        acc.save()
        operator = Operator(account=acc, group=None)
        operator.save()
    except:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return HttpResponse(status=status.HTTP_201_CREATED)


def add_client(request):
    """
        Let client register
    """

    try:
        request.POST = decode_json_body(request)
        user = User.objects.create_user(username=request.POST["username"],
                                        password=request.POST["password"])

        user.save()
        acc = Account(user=user, email=request.POST["username"])
        acc.save()
        client = Client(account=acc)
        client.save()
    except:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return HttpResponse(status=status.HTTP_201_CREATED)


@login_required
@renderer_classes(JSONRenderer)
def add_ticket(request):
    """
        Let someone add a ticket
    """
    try:
        request.POST = decode_json_body(request)

        ticket = Ticket.objects.create(
            title=request.POST["title"],
            description=request.POST["description"],
            client=Client.objects.get(pk=request.POST["client"]))

        def builder(g):
            return (g['id'], g['scores'])

        gr = list(map(builder, Group.objects.all().values()))
        thresh = 3
        guessed_group, group_scores = assign_group_to_ticket(model_to_dict(ticket), gr,
                                                             thresh)

        ticket.group = guessed_group

        ticket.save()
    except BaseException as e:
        print("excp: {}".format(e))
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return HttpResponse(status=status.HTTP_201_CREATED)


@login_required
@renderer_classes(JSONRenderer)
def add_comment(request):
    """
        Let someone leave a comment to a ticket
    """
    try:
        request.POST = decode_json_body(request)
        account = Account.objects.get(pk=request.POST["account"])
        ticket = Ticket.objects.get(pk=request.POST["ticket"])
        comment = Comment.objects.create(timestamp=request.POST["timestamp"],
                                         ticket=ticket,
                                         account=account,
                                         content=request.POST["content"])

        comment.save()
    except:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return HttpResponse(status=status.HTTP_201_CREATED)


@login_required
@renderer_classes(JSONRenderer)
def add_group(request):
    """
        Let admins add group
    """

    try:
        request.POST = decode_json_body(request)
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
            return JsonResponse(group)
        except Group.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'PUT':
        try:
            request.PUT = decode_json_body(request)
            Group.objects.filter(pk=pk).update(
                description=request.PUT["description"])
        except Group.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'DELETE':
        try:
            group = Group.objects.get(pk=pk)
            group.delete()
        except Group.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    else:
        return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    return HttpResponse(status=status.HTTP_200_OK)


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
            return JsonResponse(operator)
        except Operator.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'PUT':
        try:
            request.PUT = decode_json_body(request)
            Operator.objects.filter(pk=pk).update(group=request.PUT["group"])
            Account.objects.filter(pk=request.PUT["account"]["id"]).update(
                email=request.PUT["account"]["email"])
        except Operator.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'DELETE':
        try:
            operator = Operator.objects.get(pk=pk)
            operator.delete()
        except Operator.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    else:
        return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    return HttpResponse(status=status.HTTP_200_OK)


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
            return JsonResponse(ticket)
        except Comment.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

    return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@login_required
@renderer_classes(JSONRenderer)
def get_tickets(request):
    """
        Get all tickets in the database
    """
    return JsonResponse(
        list(map(model_to_dict, Ticket.objects.all())),
        safe=False,
    )


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
            tickets = Ticket.objects.filter(group=ticket['group']).values()

            if len(tickets) > 10:
                time_est = estimate_time([{
                    'inizio': ticket['inizio'].date(),
                    'fine': ticket['fine'].date()
                } for ticket in tickets])
            else:
                time_est = -1

            comments = list(
                map(model_to_dict, Comment.objects.filter(ticket=pk)))
            for comment in comments:
                comment['account'] = model_to_dict(
                    Account.objects.get(pk=comment['account']))['name']

            return JsonResponse({
                'title': ticket['title'],
                'description': ticket['description'],
                'status': ticket['status'],
                'group': ticket['group'],
                'comments': comments,
                'time': time_est,
            })
        except Ticket.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'PUT':
        try:
            if not request.user.groups.filter(name="Operator").exists():
                print(request.user.groups.all())
                return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)

            request.PUT = decode_json_body(request)
            ticket = Ticket.objects.get(pk=pk)
            ticket.status = request.PUT["status"]
            ticket.save()
        except Client.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    else:
        return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    return HttpResponse(status=status.HTTP_200_OK)


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
            return JsonResponse(client)
        except Client.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'PUT':
        try:
            request.PUT = decode_json_body(request)
            Account.objects.filter(pk=request.PUT["account"]["id"]).update(
                email=request.PUT["account"]["email"])
        except Client.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'DELETE':
        try:
            client = Client.objects.get(pk=pk)
            client.delete()
        except Client.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    else:
        return HttpResponse(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    return HttpResponse(status=status.HTTP_200_OK)
