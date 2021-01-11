import axios from 'axios';
import Cookies from 'js-cookie';

export const login = async (username, password) => {
  const { data } = await axios.post('http://localhost:8000/v1/auth', {
    username,
    password,
  });

  Cookies.set('token', data.token);
};
