""",
    This model contains the models
"""

from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta


class Group(models.Model):
    """
        Group models
    """
    description = models.TextField()
    scores = models.JSONField(default=dict)


class Account(models.Model):
    """
        Account models
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=72, null=True)
    email = models.CharField(max_length=72)


class Client(models.Model):
    """
        Client models
    """
    account = models.OneToOneField(Account, on_delete=models.CASCADE)

    class Meta:
        permissions = [
            ("close_ticket",
             "Can remove a task by setting its status as closed"),
            ("comment_ticket", "Can leave a comment on ticket"),
        ]


class Ticket(models.Model):
    """
        Ticket models:
            - Open
            - Closed
            - Triaged
            - Progress
    """
    readonly_fields = ('inizio', 'fine')

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
    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    inizio = models.DateTimeField(default=datetime.today())
    fine = models.DateTimeField(default=datetime.today() + timedelta(days=1))


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

    _from = models.ForeignKey(Account,
                              on_delete=models.CASCADE,
                              related_name='from_email')
    to = models.ForeignKey(Account,
                           on_delete=models.CASCADE,
                           related_name='to_email')
    # RFC 2822 states that the maximum number of characters in a subject line is
    # 998 characters. However, a lot of email clients will impose a 255/256
    # character limit.
    subject = models.CharField(max_length=998)
    # There is no lenght limit, the only thing that needs some care is line
    # can't be longer than 998 characters
    content = models.CharField(max_length=998)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)


class Comment(models.Model):
    """
        Comment models
    """

    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    content = models.CharField(max_length=9980)
    timestamp = models.DateTimeField()
