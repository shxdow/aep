#!/bin/sh

coverage run --source='ai' manage.py test ai
coverage html