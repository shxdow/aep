import { post } from '@utils/xhr';

const signup = async (username, password) => {
  await post('/v1/signup/', {
    username,
    password,
  });
};

export default { signup };
