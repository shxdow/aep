// import axios from 'axios';
// import Cookies from 'js-cookie';

// const headers = () => ({
//   Authentication: `Token ${Cookies.get('token')}`,
// });

const getTickets = async () => {
  // const { data } = await axios.get(`${global.SERVER_ADDRESS}/tickets/`, headers());
  // return data;
  return [
    { id: 1, title: 'Qualcosa non funziona', status: 'OP' },
    { id: 2, title: 'Non so inserire la password', status: 'CL' },
    { id: 3, title: 'Cosa devo fare qui?', status: 'PR' },
  ];
};

export default { getTickets };
