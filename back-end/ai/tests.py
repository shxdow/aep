"""
    Test module
"""

from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User, Group as DjangoGroup
from .models import Account, Client, Group, Operator, Ticket
from .views import add_ticket, handle_ticket, get_tickets, add_operator, handle_operator, add_client, handle_client, add_group, handle_group, auth, logout
from .ticketclassifier import increment, extract_words, max_in_dict, weight_update, assign_group_to_ticket, K1, K2, K3


class AuthTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='name', password='sur')

    def test_auth(self):
        request = self.factory.post('/auth/', {
            'username': 'name',
            'password': 'sur',
        })

    def test_logout(self):
        request = self.factory.get('/logout/')


class GroupTestCase(TestCase):
    """
        Test cases for groups
    """

    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_superuser(username='name',
                                                  password='sur')
        self.group = Group.objects.create(description="desc")
        self.group.save()

    def test_get_group(self):
        """
            Tests the get endpoint for a particular group
        """
        request = self.factory.get('/group/1/')
        request.user = self.user
        response = handle_group(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_get_fail_group(self):
        """
            Tests the get endpoint for a particular group
        """
        request = self.factory.get('/group/1213456/')
        request.user = self.user
        response = handle_group(request, 1213456)
        self.assertEqual(response.status_code, 404)

    def test_put_group(self):
        """
            Tests the edit of a particular group
        """

        request = self.factory.put('/group/1/', {
            "description": "changed",
        },
            content_type="application/json")
        request.user = self.user
        response = handle_group(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_add_fail_group(self):
        """
            Tests the failure of the creatation of a group
        """
        request = self.factory.post(
            '/group/add/', {
                "wrong param":
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eius",
            },
            content_type="application/json")

        request.user = self.user
        response = add_group(request)
        self.assertEqual(response.status_code, 500)

    def test_add_group(self):
        """
            Tests the create of a group
        """
        request = self.factory.post(
            '/group/add/', {
                "description":
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eius",
            },
            content_type="application/json")

        request.user = self.user
        response = add_group(request)
        self.assertEqual(response.status_code, 201)

    def test_patch_group(self):
        """
            Tests the get endpoint for a particular group
        """
        request = self.factory.patch('/group/1/')
        request.user = self.user
        response = handle_group(request, 1)
        self.assertEqual(response.status_code, 405)

    def test_delete_group(self):
        """
            Tests the get endpoint for a particular group
        """
        request = self.factory.delete('/group/1/')
        request.user = self.user
        response = handle_group(request, 1)
        self.assertEqual(response.status_code, 200)


class ClientTestCase(TestCase):
    """
        Test cases for clients
    """

    def setUp(self):

        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='em@ma.il',
                                             password='sur')
        self.user.save()
        self.acc = Account(user=self.user, email='em@ma.il')
        self.acc.save()
        self.client = Client(account=self.acc)
        self.client.save()

    def test_delete_client(self):
        """
            Tests the get endpoint for a particular client
        """
        request = self.factory.delete('/client/1/')
        request.user = self.user
        response = handle_client(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_patch_client(self):
        request = self.factory.patch('/client/1')
        request.user = self.user
        response = handle_client(request, 1)
        self.assertEqual(response.status_code, 405)

    def test_delete_fail_client(self):
        """
            Tests the get endpoint for a particular client
        """
        request = self.factory.delete('/client/12345/')
        request.user = self.user
        response = handle_client(request, 12345)
        self.assertEqual(response.status_code, 404)

    def test_get_client(self):
        """
            Tests the get endpoint for a particular client
        """
        request = self.factory.get('/client/1/')
        request.user = self.user
        response = handle_client(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_get_fail_client(self):
        """
            Tests the get endpoint for a particular client
        """
        request = self.factory.get('/client/12345/')
        request.user = self.user
        response = handle_client(request, 12345)
        self.assertEqual(response.status_code, 404)

    def test_put_client(self):
        request = self.factory.put('/client/1/',
                                   {
                                       "account": {'id': 1, 'email': 'changed@ma.il'},
                                   },
                                   content_type='application/json')
        request.user = self.user
        response = handle_client(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_add_client(self):
        """
            Test the creation of a client
        """

        request = self.factory.post('/client/add/', {
            "username": "op",
            "password": "psw"
        }, content_type="application/json")

        request.user = self.user
        response = add_client(request)
        self.assertEqual(response.status_code, 201)

    def test_add_fail_client(self):
        """
            Test the create of an client
        """

        request = self.factory.post('/client/add', {
            "noparam": "op",
            "password": "psw"
        }, content_type="application/json")

        request.user = self.user
        response = add_client(request)
        self.assertEqual(response.status_code, 500)


class OperatorTestCase(TestCase):
    """
        Test cases for operators
    """

    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_superuser(username='us',
                                                  email='em@al.it',
                                                  password='sur')
        self.user.save()
        self.group = DjangoGroup.objects.get_or_create(name="Operator")[0]
        self.user.groups.add(self.group)
        self.user.save()
        self.acc = Account(user=self.user, email='em@ma.il')
        self.acc.save()
        self.operator = Operator(account=self.acc, group=None)
        self.operator.save()

    def test_patch_operator(self):
        request = self.factory.patch('/operator/1')
        request.user = self.user
        response = handle_operator(request, 1)
        self.assertEqual(response.status_code, 405)

    def test_delete_operator(self):
        """
            Tests the get endpoint for a particular operator
        """
        request = self.factory.delete('/operator/1/')
        request.user = self.user
        response = handle_operator(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_delete_fail_operator(self):
        """
            Tests the get endpoint for a particular operator
        """
        request = self.factory.delete('/operator/12345/')
        request.user = self.user
        response = handle_operator(request, 12345)
        self.assertEqual(response.status_code, 404)

    def test_get_operator(self):
        """
            Tests the get endpoint for a particular operator
        """
        request = self.factory.get('/operator/1/')
        request.user = self.user
        response = handle_operator(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_get_fail_operator(self):
        """
            Tests the get endpoint for a particular operator
        """
        request = self.factory.get('/operator/12345/')
        request.user = self.user
        response = handle_operator(request, 12345)
        self.assertEqual(response.status_code, 404)

    def test_put_operator(self):
        request = self.factory.put('/operator/1/', {
            "account": {
                'id': 1,
                'email': 'changed@ma.il'
            },
            "group": None
        },
            content_type='application/json')

        request.user = self.user
        response = handle_operator(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_add_operator(self):
        """
            Test the creation of an operator
        """

        request = self.factory.post('/operator/add', {
            "username": "op",
            "password": "psw"
        }, content_type="application/json")

        request.user = self.user
        request.user.is_superuser = True
        response = add_operator(request)
        self.assertEqual(response.status_code, 201)

    def test_add_fail_operator(self):
        """
            Test the failure in the creation of an operator
        """

        request = self.factory.post('/operator/add', {
            "noparam": "op",
            "password": "psw"
        }, content_type="application/json")

        request.user = self.user
        response = add_operator(request)
        self.assertEqual(response.status_code, 500)


class TicketTestCase(TestCase):
    """
        Test cases for tickets
    """

    def setUp(self):

        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='em@ma.il',
                                             password='sur')
        self.user.save()
        self.acc = Account(user=self.user, email='em@ma.il')
        self.acc.save()
        self.client = Client(account=self.acc)
        self.client.save()

        self.ticket = Ticket(
            title='Title', description='Description', client=self.client)
        self.ticket.save()

    def test_get_all_tickets(self):
        request = self.factory.patch('/tickets')
        request.user = self.user
        response = get_tickets(request)
        self.assertEqual(response.status_code, 200)

    def test_get_ticket(self):
        """
            Tests the get endpoint for a particular ticket
        """
        request = self.factory.get('/ticket/1/')
        request.user = self.user
        response = handle_ticket(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_get_fail_ticket(self):
        """
            Tests the get endpoint for a particular ticket
        """
        request = self.factory.get('/ticket/12345/')
        request.user = self.user
        response = handle_client(request, 12345)
        self.assertEqual(response.status_code, 404)

    def test_add_ticket(self):
        """
            Test the creation of a client
        """

        request = self.factory.post('/ticket/add/', {
            "title": "Title",
            "description": "Description",
            "client": self.client.id,
        }, content_type="application/json")

        request.user = self.user
        response = add_ticket(request)
        self.assertEqual(response.status_code, 201)

    def test_add_fail_ticket(self):
        """
            Test the create of an client
        """

        request = self.factory.post(
            '/ticket/add', {}, content_type="application/json")

        request.user = self.user
        response = add_client(request)
        self.assertEqual(response.status_code, 500)


class TicketClassifierTestCase(TestCase):
    def setUp(self):
        pass

    def test_increment(self):
        dic = {'key': 1}
        increment(dic, 'key', 2)
        assert dic['key'] == 3
        increment(dic, 'missing', 4)
        assert dic['missing'] == 4

    def test_extract_words(self):
        ticket = {
            'title': 'Hello, there!',
            'description': 'This is the ticket'
        }
        words = extract_words(ticket)
        assert words == ['hello', 'there', 'this', 'is', 'the', 'ticket']

    def test_max_in_dict(self):
        assert max_in_dict({
            'a': 1,
            'b': 2,
            'c': -3
        }) == 'b'
        assert max_in_dict({}) is None
        assert max_in_dict({1: 7.1, 2: 0.1}) == 1

    def test_weight_update(self):
        assert weight_update(2) == K1
        assert weight_update(1) == K2
        assert weight_update(0) == K2
        assert weight_update(-1) == K3

    def test_assign_group(self):
        ticket = {
            'title': 'Non riesco a fare il login al portale',
            'description': 'Ho provato di tutto ma non mi accetta la password'
        }
        groups = [
            (1, {
                'portale': 5,
                'login': 1,
                'password': 1
            }),
            (2, {
                'app': 3,
                'mobile': 2,
                'telefono': 0.3
            })
        ]

        gid = assign_group_to_ticket(ticket, groups, 6)
        assert gid == 1
        _, scores = groups[0]
        assert scores['portale'] == 5 + K1
        assert scores['login'] == 1 + K2
        assert scores['password'] == 1 + K2
