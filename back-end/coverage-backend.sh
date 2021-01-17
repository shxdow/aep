#!/bin/sh

coverage run --source='.' manage.py test ai
coverage html