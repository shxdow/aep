const validate = ({ title, content }) => {
  const errors = {};
  if (!title) {
    errors.title = 'Inserisci un titolo';
  }

  if (!content) {
    errors.content = 'Specifica un contenuto';
  }

  return errors;
};

export default validate;
