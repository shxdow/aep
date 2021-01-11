## How to run

~~~~
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser # execute this only if no accounts exist
python manage.py runserver
~~~~
