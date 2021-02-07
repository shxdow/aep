import { post } from '@utils/xhr';

const login = async (username, password) => {
  const { data } = await post.noCookies('/v1/auth/', {
    username,
    password,
  });

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
