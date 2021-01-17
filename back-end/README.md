# Back-end

Questa cartella contiene il codice relativo al back-end del progetto.

## Getting started

Creare un virtual environment e installare le dipendenze necessarie

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

La prima volta sarà necessario usare questi due comandi
```
python manage.py migrate
python manage.py createsuperuser # execute this only if no accounts exist
```

Infine, è possibile far partire il server
```
python manage.py runserver
```

## More stuff

### Testing and coverage

Per eseguire i test e ottenere la coverage al tempo stesso usare il comando (necessita di `coverage` installato)
```
coverage run --source='.' manage.py test ai
```

Per ottenere l'output HTML
```
coverage html
```

### Linting

Usare il file `lint.sh` per effettuare il linting della cartella `ai`.