import moment from 'moment';

import { get, put, post } from '@utils/xhr';

const getTicketInfo = async (id) => {
  const { data } = await get(`/v1/ticket/${id}/`);
  return data;
};

const changeTicketStatus = async (id, status) => {
  await put(`/v1/ticket/${id}/`, { status });
};

const createComment = async (ticket, content) => {
  await post('/v1/comment/add/', {
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
