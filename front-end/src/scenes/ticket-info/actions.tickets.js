import axios from 'axios';
import moment from 'moment';

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
  getTicketInfo,
  createComment,
  changeTicketStatus,
};
