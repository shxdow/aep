import axios from 'axios';
import moment from 'moment';

const getTickets = async () => {
  const { data } = await axios.get(`${global.SERVER_ADDRESS}/v1/tickets`);
  return data;
};

const getTicketInfo = async (id) => {
  const { data } = await axios.get(`${global.SERVER_ADDRESS}/v1/ticket/${id}/`);
  return data;
};

const changeTicketStatus = async (id, status) => {
  await axios.put(
    `${global.SERVER_ADDRESS}/v1/ticket/${id}/`,
    { status },
  );
};

const createTicket = async (title, description) => {
  await axios.post(
    `${global.SERVER_ADDRESS}/v1/ticket/add/`,
    { title, description, client: sessionStorage.getItem('client') },
  );
};

const createComment = async (ticket, content) => {
  await axios.post(`${global.SERVER_ADDRESS}/v1/comment/add/`,
    {
      account: sessionStorage.getItem('account'),
      ticket,
      content,
      timestamp: moment().format(),
    });
};

export default {
  getTickets,
  createTicket,
  getTicketInfo,
  createComment,
  changeTicketStatus,
};
