import axios from 'axios';

const login = async (username, password) => {
  const { data } = await axios.post(`${global.SERVER_ADDRESS}/v1/auth/`, {
    username,
    password,
  }, { withCredentials: true });

  sessionStorage.setItem('loggedIn', true);
  sessionStorage.setItem('username', username);
  if (data.account) {
    sessionStorage.setItem('account', data.account);
  }
  if (data.client) {
    sessionStorage.setItem('client', data.client);
  }
};

export default { login };
