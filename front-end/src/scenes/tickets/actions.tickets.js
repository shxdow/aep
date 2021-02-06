import axios from 'axios';
import cookies from 'js-cookie';

const getTickets = async () => {
  const { data } = await axios.get(`${global.SERVER_ADDRESS}/v1/tickets`, { withCredentials: true });
  return data;
};

const createTicket = async (title, description) => {
  await axios.post(
    `${global.SERVER_ADDRESS}/v1/ticket/add/`,
    { title, description, client: sessionStorage.getItem('client') },
    {
      headers: {
        'x-csrftoken': cookies.get('csrftoken'),
      },
      withCredentials: true,
    },
  );
};

export default {
  getTickets,
  createTicket,
};
