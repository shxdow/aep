"""
    This model contains the models
"""

from django.db import models
from django.contrib.auth.models import User

class Group(models.Model):
    """
        Group models
    """
    description = models.TextField()


class Ticket(models.Model):
    """
        Ticket models:
            - Open
            - Closed
            - Triaged
            - Progress
    """

    OPEN = 'OP'
    CLOSED = 'CL'
    TRIAGED = 'TR'
    PROGRESS = 'PR'

    STATUS_OPTIONS = [
        (OPEN, 'Open'),
        (CLOSED, 'Closed'),
        (TRIAGED, 'Triaged'),
        (PROGRESS, 'Progress'),
    ]
    title = models.CharField(max_length=72)
    description = models.TextField()
    status = models.CharField(max_length=2,
                              choices=STATUS_OPTIONS,
                              default=OPEN)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)


class Account(models.Model):
    """
        Account models
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #  name = models.CharField(max_length=72, null=True)
    #  surname = models.CharField(max_length=72, null=True)
    username = models.CharField(max_length=72)
    email = models.CharField(max_length=72, null=True)


class Comment(models.Model):
    """
        Comment models
    """

    account_id = models.ForeignKey(Account, on_delete=models.CASCADE)
    ticket_id = models.ForeignKey(Ticket, on_delete=models.CASCADE)


class Client(models.Model):
    """
        Client models
    """
    account_id = models.OneToOneField(Account, on_delete=models.CASCADE)

    class Meta:
        permissions = [
            ("close_ticket",
             "Can remove a task by setting its status as closed"),
            ("comment_ticket", "Can leave a comment on ticket"),
        ]


class Operator(models.Model):
    """
        Operator models
    """
    account = models.OneToOneField(
        Account,
        on_delete=models.CASCADE,
    )

    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True)

    class Meta:
        permissions = [
            ("close_ticket",
             "Can remove a task by setting its status as closed"),
            ("change_ticket_status", "Can change the status of tasks"),
        ]


class Mail(models.Model):
    """
        Mail models
    """

    _from = models.IntegerField()
    to = models.IntegerField()
    # RFC 2822 states that the maximum number of characters in a subject line is
    # 998 characters. However, a lot of email clients will impose a 255/256
    # character limit.
    subject = models.CharField(max_length=998)
    # There is no lenght limit, the only thing that needs some care is line
    # can't be longer than 998 characters
    content = models.CharField(max_length=998)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
