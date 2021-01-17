import axios from 'axios';

const signup = async (username, password) => {
  await axios.post(`${global.SERVER_ADDRESS}/v1/signup/`, {
    username,
    password,
  });
};

export default { signup };
