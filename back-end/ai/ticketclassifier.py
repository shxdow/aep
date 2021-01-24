"""
    Questo modulo contiene le varie funzioni necessarie all'assegnamento del ticket
    al gruppo e alla stima dei tempi di risoluzione
"""

import re

K1 = 0.5
K2 = 0.1
K3 = -0.5


def assign_group_to_ticket(ticket, groups, threshold):
    """
        Funzione che assegna un ticket ad un gruppo

        ### Parametri
        - `ticket`: dizionario con `"title"` e `"description"`
        - `groups`: lista di tuple (id, scores), con id una chiave primaria e scores un dizionario { [string]: double }
        - `threshold`: soglia minima per il punteggio

        ### Valore ritornato
        Una tupla con
        - l'id del gruppo scelto
        - l'elenco dei gruppi con gli scores aggiornati
    """
    points = {}
    words = extract_words(ticket)

    for word in words:
        for (gid, scores) in groups:
            point = scores[word] if word in scores else 0
            increment(points, gid, point)
            increment(scores, word, weight_update(point))

    gid = max_in_dict(points)
    return points[gid] if points[gid] > threshold else None


def increment(dic, key, val):
    """
        Funzione che incrementa il valore di una chiave in un dizionario,
        o la aggiunge se mancante

        ### Parametri
        - `dic`: dizionario da aggiornare
        - `key`: la chiave del valore da aggiornare
        - `val`: il valore da sommare
    """
    if key in dic:
        dic[key] += val
    else:
        dic[key] = val


def extract_words(ticket):
    """
        Estrae le parole chiave dal ticket

        ### Parametri
        - `ticket`: dizionario con "title" e "description", due stringhe

        ### Valore ritornato
        Un oggetto map contenente le parole, tutte in lower case
    """
    content = f'{ticket["title"]} {ticket["description"]}'
    return [s.lower() for s in re.split(r'\W+', content) if len(s) > 0]


def weight_update(weight):
    """
        Calcola il valore di aggiornamento per un peso `weight`

        ### Parametri
        Il peso `weight`, double

        ### Valore ritornato
        Il valore di aggiornamento per il peso
    """
    if weight > 1:
        return K1
    if weight >= 0:
        return K2
    return K3


def max_in_dict(dic):
    """
        Ritorna la chiave con il valore massimo nel dizionario

        ### Parametri
        - `dic`: il dizionario da analizzare

        ### Valore ritornato
        La chiave con il valore massimo in `dic`
    """
    return max(dic, key=lambda k: dic[k])


def estimate_time(tickets):
    """
        Fa una stima del tempo di chiusura basata su un elenco di ticket

        ### Parametri
        - `tickets`: la lista dei ticket passati, ciascuno un dizionario con almeno le chiavi
            `"inizio"` e `"fine"`, dei timestamp

        ### Valore ritornato
        Una predizione del tempo impiegato per chiudere il prossimo ticket
    """
    times = map(lambda t: t['fine'] - t['inizio'], tickets)
    # TODO: fit arima on times
    # TODO: return prediction
    return 0
