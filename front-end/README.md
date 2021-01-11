# Front-end

Il front-end è realizzato con la libreria React.

## Getting started

Per installare le dipendenze, usare `yarn` e lanciare `yarn install` in questa cartella.

### `yarn start`

Avvia il front-end in modalità sviluppo.\
Il sito è disponibile all'indirizzo [http://localhost:3000](http://localhost:3000).

La pagina si ricarica in automatico se vengono modificati dei file.

### `yarn test`

Esegue i test.

### `yarn build`

Compila la app per la produzione nella cartella `build`.\
La build è minificata ed i nomi dei file includono l'hash.

## Environment

Creare nella cartella `src` un file `.env` con il seguente formato.
```
global.SERVER_ADDRESS = 'http://your.server.com:port'
```
