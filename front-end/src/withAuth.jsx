import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

import FakeLoadingPage from './components/page/FakeLoadingPage';

const withAuth = (WrappedComponent, roles = null) => (props) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const history = useHistory();

  useEffect(() => {
    try {
      setLoading(true);
      if (Cookies.get('token')) {
        setIsAuthorized(true);
        setLoading(false);
      } else {
        history.push('/login');
      }
    } catch (error) {
      setLoading(false);
    }
  }, [history]);

  if (loading) {
    return <FakeLoadingPage />;
  }

  if (isAuthorized) {
    return <WrappedComponent {...props} />;
  }

  return null;
};

export default withAuth;
