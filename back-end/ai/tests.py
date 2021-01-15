"""
    Test module
"""

from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from ai.models import Account, Client, Group, Operator
from .views import add_operator, handle_operator, add_client, handle_client, add_group, handle_group


class GroupTestCase(TestCase):
    """
        Test cases for groups
    """

    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='name', password='sur')

    def test_get_group(self):
        """
            Tests the get endpoint for a particular group
        """
        request = self.factory.get('/group/1/')
        request.user = self.user
        response = handle_group(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_put_group(self):
        """
            Tests the edit of a particular group
        """

        request = self.factory.put('/group/1/', {
            "description": "changed",
        })
        request.user = self.user
        response = handle_group(request, 1)
        self.assertEqual(response.status_code, 201)

    def test_add_group(self):
        """
            Tests the create of a group
        """
        request = self.factory.post(
            '/group/add/', {
                "description":
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eius",
            })

        request.user = self.user
        response = add_group(request)
        self.assertEqual(response.status_code, 201)


class ClientTestCase(TestCase):
    """
        Test cases for clients
    """
    def setUp(self):

        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='name', password='sur')
        self.user.save()
        self.acc = Account(user=self.user, username='name')
        self.acc.save()
        self.client = Client(account_id=self.acc)
        self.client.save()

    def test_get_client(self):
        """
            Tests the get endpoint for a particular client
        """
        request = self.factory.get('/client/1/')
        request.user = self.user
        response = handle_client(request, 1)
        self.assertEqual(response.status_code, 200)

    #  def test_put_client(self):
    #      request = self.factory.put('/client/1/', {
    #          "username": "op",
    #          "password": "psw"
    #      })
    #      request.user = self.user
    #      response = handle_client(request, 1)
    #      self.assertEqual(response.status_code, 201)

    def test_add_client(self):
        """
            Test the create of a client
        """

        request = self.factory.post('/operator/add/', {
            "username": "op",
            "password": "psw"
        })

        request.user = self.user
        response = add_client(request)
        self.assertEqual(response.status_code, 201)


class OperatorTestCase(TestCase):
    """
        Test cases for operators
    """
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='name', password='sur')
        self.user.save()
        self.acc = Account(user=self.user, username='name')
        self.acc.save()
        self.operator = Operator(account=self.acc, group=None)
        self.operator.save()

    def test_get_opertor(self):
        """
            Tests the get endpoint for a particular operator
        """
        request = self.factory.get('/operator/1/')
        request.user = self.user
        response = handle_operator(request, 1)
        self.assertEqual(response.status_code, 200)

    #  def test_put_opertor(self):
    #      request = self.factory.put('/operator/1/', {
    #          "username": "op",
    #          "password": "psw"
    #      })
    #      request.user = self.user
    #      response = handle_operator(request)
    #      self.assertEqual(response.status_code, 201)

    def test_add_operator(self):
        """
            Test the create of an operator
        """

        request = self.factory.post('/operator/add', {
            "username": "op",
            "password": "psw"
        })

        request.user = self.user
        response = add_operator(request)
        self.assertEqual(response.status_code, 201)


class GroupTestCase(TestCase):
    """
        Groups test cases
    """
    def setUp(self):
        Group.objects.create(description="Engineering")
        Group.objects.create(description="Sales lol")
        Group.objects.create(description="Marketing")

    def test_group_exists(self):
        """
            Tests the group exist
        """
        eng_team = Group.objects.get(description="Engineering")
        self.assertEqual(eng_team.description, "Engineering")