import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Button, Col, Image, Alert } from 'react-bootstrap';

import BackgroundImage from '../../resources/login.jpeg';

import validate from './validation.login';

const Login = () => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: check if logged in
    setLoading(false);
    setError('');
  }, []);

  const updateUsername = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const updatePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const login = useCallback(
    async (e) => {
      e.preventDefault();

      const errors = validate({ username, password });
      if (errors.username || errors.password) {
        setUsernameError(errors.username);
        setPasswordError(errors.password);
        return;
      }

      setLoading(true);
      // TODO: Login
      setLoading(false);
    },
    [username, password]
  );

  if (loading) {
    return 'Loading...';
  }

  return (
    <div className="bg-gradient-primary" style={{ height: '100%', overflowY: 'scroll' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <Card className="m-5">
              <Card.Body className="p-0">
                <div className="row">
                  <Col lg={6}>
                    <Image src={BackgroundImage} height="100%" rounded fluid />
                  </Col>
                  <Col lg={6}>
                    <Card.Title className="text-gray-900 row justify-content-center pt-3" style={{ fontSize: 32 }}>
                      Login
                    </Card.Title>
                    <Card.Subtitle className="row justify-content-center pb-5">
                      Inserisci le tue credenziali per effettuare il login
                    </Card.Subtitle>
                    <Form onSubmit={login}>
                      <div className="p-3 pb-0">
                        <Form.Group controlId="username">
                          <Form.Control
                            name="username"
                            value={username}
                            onChange={updateUsername}
                            type="text"
                            placeholder="Inserisci il nome utente"
                            isInvalid={usernameError}
                          />
                          <Form.Control.Feedback type="invalid">{usernameError}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="password">
                          <Form.Control
                            name="password"
                            value={password}
                            onChange={updatePassword}
                            type="password"
                            placeholder="Inserisci la password"
                            isInvalid={passwordError}
                          />
                          <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      {error && (
                        <div className="p-3">
                          <Alert variant="danger">{error}</Alert>
                        </div>
                      )}
                      <div className="p-3">
                        <Button
                          block
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="text-uppercase"
                          onClick={login}
                          disabled={loading}
                        >
                          {`Login${loading ? ' ...' : ''}`}
                        </Button>
                      </div>
                      <div className="p-3 text-center">
                        <Link to="/account/new">Nuovo account</Link>
                      </div>
                    </Form>
                  </Col>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
