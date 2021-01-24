import axios from 'axios';

const getTickets = async () => {
  const { data } = await axios.get(`${global.SERVER_ADDRESS}/v1/tickets`);
  return data;
};

const createTicket = async (title, description) => {
  await axios.post(
    `${global.SERVER_ADDRESS}/v1/ticket/add/`,
    { title, description, client: sessionStorage.getItem('client') },
  );
};

export default {
  getTickets,
  createTicket,
};
