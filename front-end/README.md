# Front-end

Il front-end è realizzato con la libreria React.

## Getting started

Per installare le dipendenze, usare `yarn` e lanciare `yarn install` in questa cartella.

### `yarn start`

Avvia il front-end in modalità sviluppo.\
Il sito è disponibile all'indirizzo [http://localhost:3000](http://localhost:3000).

La pagina si ricarica in automatico se vengono modificati dei file.

### `yarn build`

Compila la app per la produzione nella cartella `build`.\
La build è minificata ed i nomi dei file includono l'hash.

### `yarn electron`

Fa partire la app in electron usando (di default) gli artifacts compilati
che si trovano sotto `build`.

## Code Quality

### `yarn test`

Esegue i test.

### `yarn converage`

Genera dei report di test coverage nella cartella `coverage`.

### `yarn lint` e `yarn lint-pretty`

Genera dei report di analisi statica del codice, eventualmente mettendo
il report nella cartella `linting`.

## Environment

Creare nella cartella `src` un file `secrets.js` con il seguente formato.
```
global.SERVER_ADDRESS = 'http://your.server.com:port'
```

## Compilazione per electron

Per compilare per electron lanciare il comando `yarn electron-build`.
