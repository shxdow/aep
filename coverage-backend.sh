#!/bin/sh

cd back-end
coverage run --source='.' manage.py test ai
coverage html