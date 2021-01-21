import axios from 'axios';
import Cookies from 'js-cookie';

const headers = () => ({
  Authentication: `Token ${Cookies.get('token')}`,
});

const getTickets = async () => {
  // const { data } = await axios.get(`${global.SERVER_ADDRESS}/tickets/`, headers());
  // return data;
  return [
    { id: 1, title: 'Qualcosa non funziona', status: 'OP' },
    { id: 2, title: 'Non so inserire la password', status: 'CL' },
    { id: 3, title: 'Cosa devo fare qui?', status: 'PR' },
  ];
};

const getTicketInfo = async (id) => {
  // const { data } = await axios.get(`${global.SERVER_ADDRESS}/tickets/${id}`, headers());
  // return data;
  return {
    id,
    title: 'Qualcosa non funziona',
    content: 'Non so reimpostare la password della app',
    status: 'OP',
    group: null,
    comments: [
      { id: 1, user: 'Operatore 1', content: 'What' },
      { id: 2, user: 'Operatore 1', content: 'What' },
      { id: 3, user: 'Operatore 1', content: 'What' },
    ],
  };
};

const changeTicketStatus = async (id, status) => {
  await axios.put(
    `${global.SERVER_ADDRESS}/tickets/change_status/`,
    { id, status },
    headers(),
  );
};

const createTicket = async (title, content) => {
  await axios.post(
    `${global.SERVER_ADDRESS}/tickets/add/`,
    { title, content },
    headers(),
  );
};

const createComment = async (userId, ticketId, content) => {
  await axios.post(
    `${global.SERVER_ADDRESS}/comments/add/`,
    { userId, ticketId, content },
    headers(),
  );
};

export default {
  getTickets,
  createTicket,
  getTicketInfo,
  createComment,
  changeTicketStatus,
};
