import axios from 'axios';
import moment from 'moment';
import cookies from 'js-cookie';

const getTicketInfo = async (id) => {
  const { data } = await axios.get(`${global.SERVER_ADDRESS}/v1/ticket/${id}/`, { withCredentials: true });
  return data;
};

const changeTicketStatus = async (id, status) => {
  await axios.put(
    `${global.SERVER_ADDRESS}/v1/ticket/${id}/`,
    { status },
    {
      headers: {
        'x-csrftoken': cookies.get('csrftoken'),
      },
      withCredentials: true,
    },
  );
};

const createComment = async (ticket, content) => {
  await axios.post(`${global.SERVER_ADDRESS}/v1/comment/add/`,
    {
      account: sessionStorage.getItem('account'),
      ticket,
      content,
      timestamp: moment().format(),
    },
    {
      headers: {
        'x-csrftoken': cookies.get('csrftoken'),
      },
      withCredentials: true,
    });
};

export default {
  getTicketInfo,
  createComment,
  changeTicketStatus,
};
