# Descrizione casi d'uso

### Elenco attori

* *Utente registrato*: un utente esterno all'azienda che si è registrato al portale per la gestione dei ticket
* *Utente non registrato*: un qualsiasi utente esterno all'azienda
* *Operatore*: un dipendente dell'azienda registrato nel sistema di gestione dei ticket

### Elenco casi d'uso

| Codice | Descrizione                                                  |
| ------ | ------------------------------------------------------------ |
| `U1`   | Un utente registrato crea un nuovo ticket da form web        |
| `U2`   | Un utente non registrato crea un nuovo ticket inviando una mail |
| `U3`   | Un utente (sia registrato sia non registrato) può controllare lo stato del ticket |
| `U4`   | Un utente registrato può usare il portale per comunicare (inserendo dei commenti) con l'operatore assegnato al ticket |
| `U5`   | Un utente crea e gestisce l'account                          |
| `S1`   | Il sistema assegna in automatico un nuovo ticket ad un gruppo di operatori |
| `S2`   | Il sistema può assegnare in automatico un nuovo ticket ad un operatore specifico |
| `S3`   | Il sistema fornisce una mail ad un utente non registrato per poter comunicare con l'operatore |
| `S4`   | Il sistema prevede il tempo di chiusura del ticket basandosi su dati storici dei ticket |
| `O1`   | Un operatore può cambiare lo stato del ticket (aperto/chiuso/assegnato/in corso) |
| `O2`   | Un operatore può inserire commenti sui ticket a cui è assegnato |
| `A1`   | Un operatore interno all'azienda con il ruolo di amministratore gestisce l'elenco degli operatori |

