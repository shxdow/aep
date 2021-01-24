export const Status = {
  Open: 'OP',
  Closed: 'CL',
  Triaged: 'TR',
  Progress: 'PR',
  format: ({ value }) => ({
    [Status.Open]: 'Aperto',
    [Status.Closed]: 'Chiuso',
    [Status.Progress]: 'In corso',
    [Status.Triaged]: 'Assegnato',
  }[value]),
};

export default { Status };
