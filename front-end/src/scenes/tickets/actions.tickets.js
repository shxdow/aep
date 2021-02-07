import { get, post } from '@utils/xhr';

const getTickets = async () => {
  const { data } = await get('/v1/tickets');
  return data;
};

const createTicket = async (title, description) => {
  await post('/v1/ticket/add/', {
    title,
    description,
    client: sessionStorage.getItem('client'),
  });
};

export default {
  getTickets,
  createTicket,
};
