import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import FakeLoadingPage from './components/page/FakeLoadingPage';

const withAuth = (WrappedComponent) => (props) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    try {
      setLoading(true);
      if (sessionStorage.getItem('loggedIn')) {
        setIsAuthorized(true);
        setLoading(false);
      } else {
        history.push('/login');
      }
    } catch (error) {
      setLoading(false);
    }
  }, [history]);

  useEffect(() => {
    if (location.pathname === '/tickets/new' && !sessionStorage.getItem('client')) {
      history.push('/');
    }
  }, [history, location.pathname]);

  if (loading) {
    return <FakeLoadingPage />;
  }

  if (isAuthorized) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <WrappedComponent {...props} />;
  }

  return null;
};

export default withAuth;
