# Descrizione casi d'uso

### Elenco attori

* *Utente registrato*: un utente esterno all'azienda che si è registrato al portale per la gestione dei ticket
* *Utente non registrato*: un qualsiasi utente esterno all'azienda
* *Operatore*: un dipendente dell'azienda registrato nel sistema di gestione dei ticket

### Elenco casi d'uso

| Codice | Descrizione                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| `U1`   | Un utente registrato crea un nuovo ticket da form                                                                     |
| `U2`   | Un utente non registrato crea un nuovo ticket inviando una mail                                                       |
| `U3`   | Un utente (sia registrato sia non registrato) può controllare lo stato del ticket                                     |
| `U4`   | Un utente registrato può usare il portale per comunicare (inserendo dei commenti) con l'operatore assegnato al ticket |
| `U5`   | Un utente crea e gestisce l'account                                                                                   |
| `S1`   | Il sistema assegna in automatico un nuovo ticket ad un gruppo di operatori o ad un operatore specifico                |
| `S2`   | Il sistema fornisce una mail ad un utente non registrato per poter comunicare con l'operatore                         |
| `O1`   | Un operatore può cambiare lo stato del ticket (aperto/chiuso/assegnato/in corso)                                      |
| `O2`   | Un operatore può inserire commenti sui ticket a cui è assegnato                                                       |
| `A1`   | Un amministratore interno all'azienda gestisce l'elenco degli operatori                                               |
| `A2`   | Un amministratore interno all'azienda assegna manualmente i ticket ad un operatore specifico                          |
| `G1`   | Caso d'uso generico che rappresenta l'inserimento di un ticket                                                        |

### Dettagli casi d'uso

- `U1`: *Inserimento ticket via form*
  - **Descrizione**: L'utente desidera creare un nuovo ticket tramite form web
  - **Attori**: Utente
  - **Precondizioni**: L'utente ha effettuato il login e si trova nel form di creazione ticket
  - **Passi principali**
    1. L'utente inserisce titolo e descrizione del ticket
    2. L'utente crea il nuovo ticket
    3. Il sistema inserisce il nuovo ticket in database
    4. Il sistema assegna in automatico il ticket (S1)
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: Il ticket è inserito in database
  
- `U2`: *Inserimento ticket via mail*
  - **Descrizione**: L'utente desidera creare un nuovo ticket tramite email
  - **Attori**: Utente
  - **Precondizioni**: Nessuna
  - **Passi principali**
    1. L'utente invia una mail al sistema di ticketing
    2. Il sistema inserisce i dati in database
    3. Il sistema genera una mail di comunicazione (S2)
    4. L'utente viene notificato dal sistema dell'avvenuta ricezione
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: Il ticket è inserito in database

- `U3`: *Controllo stato ticket*
  - **Descrizione**: L'utente controlla lo stato del ticket (aperto/assegnato/in corso/chiuso)
  - **Attori**: Utente
  - **Precondizioni**: L'utente conosce l'identificativo del ticket
  - **Passi principali**
    1. L'utente naviga alla pagina di stato dello specifico ticket
    2. Il sistema invia all'utente le varie informazioni sul ticket, tra cui titolo, descrizione e stato
  - **Situazioni eccezionali**:
    - Se il ticket è stato inviato tramite mail, è visibile solamente lo stato del ticket
  - **Postcondizioni**: Nessuna

- `U4`: *Inserimento di commenti sul ticket*
  - **Descrizione**: L'utente inserisce un commento in un ticket già aperto
  - **Attori**: Utente
  - **Precondizioni**: L'utente deve aver effettuato il login ed il ticket deve esistere
  - **Passi principali**
    1. L'utente inserisce un nuovo commento
    2. L'utente salva il commento
    3. Il sistema inserisce il commento in database
  - **Situazioni eccezionali**: Se il ticket è assegnato ad un operatore, l'operatore viene notificato
  - **Postcondizioni**: Il commento è inserito in database

- `U5`: *Gestione account*
  - **Descrizione**: L'utente modifica i dati inseriti in fase di registrazione
  - **Attori**: Utente
  - **Precondizioni**: L'utente deve aver effettuato il login
  - **Passi principali**
    1. L'utente inserisce i nuovi dati da aggiornare
    2. L'utente salva i nuovi dati
    3. Il sistema riceve i dati e aggiorna le informazioni in database
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: Il ticket viene inserito in database dal sistema

- `S1`: *Assegnamento automatico del ticket*
  - **Descrizione**: Il ticket è assegnato automaticamente ad un gruppo
  - **Attori**: Nessuno
  - **Precondizioni**: Il sistema ha ricevuto e inserito in database un nuovo ticket
  - **Passi principali**
    1. Il sistema valuta il miglior gruppo a cui assegnare il ticket sulla base delle informazioni presenti in database
    2. Il sistema aggiorna le informazioni in database di conseguenza
    3. Il sistema notifica il corrispondente gruppo di operatori
  - **Situazioni eccezionali**: Il ticket può non essere assegnato se non sono presenti abbastanza informazioni
  - **Postcondizioni**: Il ticket è assegnato ad un gruppo

- `S2`: *Generazione mail di comunicazione*
  - **Descrizione**: Il sistema genera una mail che comunica all'utente per la comunicazione con gli operatori
  - **Attori**: Nessuno
  - **Precondizioni**: Il sistema ha ricevuto e inserito in database un nuovo ticket
  - **Passi principali**
    1. Il sistema genera un indirizzo mail per le comunicazioni sullo specifico ticket
    2. Il sistema comunica all'utente questo indirizzo mail
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: L'utente è in possesso di una mail per la comunicazione con gli operatori

- `O1`: *Gestione stato ticket*
  - **Descrizione**: Un operatore cambia lo stato del ticket
  - **Attori**: Operatore
  - **Precondizioni**: Il ticket deve esistere in database e dev'essere stato assegnato, l'operatore deve aver effettuato il login
  - **Passi principali**
    1. L'operatore modifica lo stato del ticket
    2. Il sistema aggiorna lo stato del ticket in database
    3. Il sistema notifica l'utente dell'avvenuto cambiamento di stato
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: Il ticket ha il nuovo stato e l'utente è stato avvisato

- `O2`: *Inserimento di commenti sul ticket*
  - **Descrizione**: Un operatore aggiunge commenti su uno specifico ticket
  - **Attori**: Operatore
  - **Precondizioni**: Il ticket deve esistere in database e dev'essere stato assegnato, l'operatore deve aver effettuato il login
  - **Passi principali**
    1. L'operatore inserisce un nuovo commento
    2. L'operatore salva il commento
    3. Il sistema inserisce il commento in database
    4. Il sistema notifica l'utente dell'avvenuto inserimento del commento
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: Il commento è inserito in database

- `A1.1`: *Gestione operatori - inserimento*
  - **Descrizione**: Un amministratore inserisce un nuovo operatore
  - **Attori**: Amministratore
  - **Precondizioni**: L'amministratore deve aver effettuato il login
  - **Passi principali**
    1. L'amministratore inserisce i dati del nuovo operatore
    2. L'amministratore salva i nuovi dati
    3. Il sistema inserisce i dati in database
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: Il nuovo operatore risulta inserito

- `A1.2`: *Gestione operatori - modifica*
  - **Descrizione**: Un amministratore modifica un nuovo operatore
  - **Attori**: Amministratore
  - **Precondizioni**: L'amministratore deve aver effettuato il login
  - **Passi principali**
    1. L'amministratore modifica i dati del nuovo operatore
    2. L'amministratore salva i nuovi dati
    3. Il sistema modifica i dati in database
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: Il nuovo operatore risulta aggiornato

- `A1.2`: *Gestione operatori - modifica*
  - **Descrizione**: Un amministratore modifica un nuovo operatore
  - **Attori**: Amministratore
  - **Precondizioni**: L'amministratore deve aver effettuato il login
  - **Passi principali**
    1. L'amministratore modifica i dati del nuovo operatore
    2. L'amministratore salva i nuovi dati
    3. Il sistema modifica i dati in database
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: L'operatore risulta aggiornato

- `A1.3`: *Gestione operatori - elimina*
  - **Descrizione**: Un amministratore elimina un nuovo operatore
  - **Attori**: Amministratore
  - **Precondizioni**: L'amministratore deve aver effettuato il login
  - **Passi principali**
    1. L'amministratore elimina un operatore
    2. Il sistema aggiorna i dati in database segnando l'operatore come "eliminato"
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: L'operatore risulta eliminato

- `A2`: *Assegnamento manuale del ticket*
  - **Descrizione**: Un amministratore assegna manualmente il ticket ad un gruppo di operatori
  - **Attori**: Amministratore
  - **Precondizioni**: L'amministratore deve aver effettuato il login
  - **Passi principali**
    1. L'amministratore cambia i dati del ticket inserendo il gruppo a cui assegnarlo
    2. L'amministratore salva i dati
    3. Il sistema modifica i dati in database
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: Il ticket risulta assegnato al gruppo specificato

- `G1`: *Assegnamento del ticket*
  - **Descrizione**: Caso d'uso generico che rappresenta l'assegnamento di un ticket ad un gruppo di operatori
  - **Attori**: Nessuno
  - **Precondizioni**: Nessuna
  - **Passi principali**: Nessuno
  - **Situazioni eccezionali**: Nessuna
  - **Postcondizioni**: Il ticket risulta assegnato ad un gruppo di operatori