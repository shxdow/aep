import axios from 'axios';
import Cookies from 'js-cookie';

const login = async (username, password) => {
  const { data } = await axios.post(`${global.SERVER_ADDRESS}/v1/auth/`, {
    username,
    password,
  });

  Cookies.set('token', data.token);
  Cookies.set('username', username);
};

export default { login };
