const validate = ({ username, password }) => {
  const errors = {};
  if (!username) errors.username = 'Il nome utente è obbligatorio';
  if (!password) errors.password = 'La password è obbligatoria';

  return errors;
};

export default validate;
