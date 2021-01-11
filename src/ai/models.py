from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class Group(models.Model):
    description = models.TextField()


class Ticket(models.Model):

    OPEN = 'OP'
    CLOSED = 'CL'
    TRIAGED = 'TR'  # Il sistema automatico ha effettuato lo smistamento
    PROGRESS = 'PR'  # Le persone hanno iniziato a lavorarci

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


class Operator(models.Model):
    class Meta:
        permissions = [
            ("close_ticket",
             "Can remove a task by setting its status as closed"),
            ("change_ticket_status", "Can change the status of tasks"),
        ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
    )


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    permissions = [("close_ticket",
                    "Can remove a task by setting its status as closed"),
                   ("delete_ticket", "Can delete ticket"),
                   ("change_ticket_status", "Can change the status of tasks"),
                   ("add_operator", "Can add operators"),
                   ("edit_operator", "Can edit operators"),
                   ("view_operator", "Can view operators"),
                   ("delete_operator", "Can delete operators")]


class Mail(models.Model):
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
