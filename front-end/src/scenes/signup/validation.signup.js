const validatePassword = (password) => {
  if (!password) {
    return 'La password è obbligatoria';
  }

  if (password.length < 6) {
    return "La password dev'essere lunga almeno 6 caratteri";
  }

  if (!/[A-Z]/.test(password)) {
    return 'La password deve contenere almeno una lettera maiuscola';
  }

  if (!/[a-z]/.test(password)) {
    return 'La password deve contenere almeno una lettera minuscola';
  }

  if (!/[0-9]/.test(password)) {
    return 'La password deve contenere almeno un numero';
  }

  return null;
};

const validate = ({ username, password, confermaPassword }) => {
  const errors = {};
  if (!username) {
    errors.username = 'Il nome utente è obbligatorio';
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  if (confermaPassword !== password) {
    errors.confermaPassword = 'Questa password non coincide con quella sopra';
  }

  return errors;
};

export default validate;
