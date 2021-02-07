import React, { useState, useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Card, Form, Button, Col, Alert } from 'react-bootstrap';

import actions from './actions.signup';
import validate from './validation.signup';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [confermaPassword, setConfermaPassword] = useState('');
  const [confermaPasswordError, setConfermaPasswordError] = useState('');

  const [error, setError] = useState('');
  const history = useHistory();

  const updateUsername = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const updatePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const updateConfermaPassword = useCallback((e) => {
    setConfermaPassword(e.target.value);
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    const errors = validate({ username, password, confermaPassword });
    if (name === 'username') {
      setUsernameError(errors.username);
    } else if (name === 'password') {
      setPasswordError(errors.password);
    } else if (name === 'confermaPassword') {
      setConfermaPasswordError(errors.confermaPassword);
    }
  }, [username, password, confermaPassword]);

  const signup = useCallback(
    async (e) => {
      e.preventDefault();

      const errors = validate({ username, password, confermaPassword });
      if (errors.username || errors.password || errors.confermaPassword) {
        setUsernameError(errors.username);
        setPasswordError(errors.password);
        setConfermaPasswordError(errors.confermaPassword);
        return;
      }

      setLoading(true);
      try {
        await actions.signup(username, password);
        history.push('/login');
      } catch (ex) {
        setError(ex.message);
        setLoading(false);
      }
    },
    [username, password, confermaPassword, history],
  );

  return (
    <div className="bg-gradient-primary" style={{ height: '100%', overflowY: 'scroll' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <Card className="m-5">
              <Card.Body className="p-0">
                <div className="row">
                  <Col lg={12}>
                    <Card.Title className="text-gray-900 row justify-content-center pt-3" style={{ fontSize: 32 }}>
                      Registrazione
                    </Card.Title>
                    <Card.Subtitle className="row justify-content-center pb-5">
                      Inserisci i tuoi dati
                    </Card.Subtitle>
                    <Form onSubmit={signup}>
                      <div className="p-3 pb-0">
                        <Form.Group controlId="username">
                          <Form.Label>Nome utente</Form.Label>
                          <Form.Control
                            name="username"
                            value={username}
                            onChange={updateUsername}
                            type="text"
                            isInvalid={usernameError}
                            onBlur={handleBlur}
                          />
                          <Form.Control.Feedback type="invalid">{usernameError}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="password">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            name="password"
                            value={password}
                            onChange={updatePassword}
                            type="password"
                            isInvalid={passwordError}
                            onBlur={handleBlur}
                          />
                          <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="confermaPassword">
                          <Form.Label>Conferma password</Form.Label>
                          <Form.Control
                            name="confermaPassword"
                            value={confermaPassword}
                            onChange={updateConfermaPassword}
                            type="password"
                            isInvalid={confermaPasswordError}
                            onBlur={handleBlur}
                          />
                          <Form.Control.Feedback type="invalid">{confermaPasswordError}</Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      {error && (
                        <div className="p-3">
                          <Alert variant="danger">{error}</Alert>
                        </div>
                      )}
                      <div className="p-3">
                        <Button
                          data-testid="signup-button"
                          block
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="text-uppercase"
                          onClick={signup}
                          disabled={loading}
                        >
                          {loading ? '...' : 'Crea account'}
                        </Button>
                        <div className="p-3 text-center">
                          <Link to="/login">Torna al login</Link>
                        </div>
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

export default Signup;
