import React, { useState, useCallback } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

import validate from './validation.registration';

const Registration = () => {
  const [values, setValues] = useState({
    username: '',
    password: '',
    confermaPassword: '',
    nominativo: '',
    azienda: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confermaPassword: '',
    nominativo: '',
    azienda: '',
  });

  const handleChange = useCallback((e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();

      const errors = validate(values);
      setErrors(errors);
      if (Object.values(errors).some((x) => !!x)) {
        return;
      }

      // TODO: Create account
    },
    [values]
  );

  return (
    <div className="bg-gradient-primary" style={{ height: '100%', overflowY: 'scroll' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <Card className="m-5">
              <Card.Body className="p-0">
                <div className="row">
                  <div className="col-12">
                    <Card.Title className="text-gray-900 row justify-content-center pt-3" style={{ fontSize: 32 }}>
                      Nuovo account
                    </Card.Title>
                    <Card.Subtitle className="row justify-content-center pb-5">
                      Inserisci i dati per poter creare il tuo account
                    </Card.Subtitle>
                    <Form onSubmit={submit}>
                      <div className="p-3 pb-0">
                        <Form.Group controlId="nominativo">
                          <Form.Label>Nome e cognome</Form.Label>
                          <Form.Control
                            name="nominativo"
                            value={values.nominativo}
                            onChange={handleChange}
                            type="text"
                            placeholder="Marco Rossi"
                            isInvalid={errors.nominativo}
                          />
                          <Form.Control.Feedback type="invalid">{errors.nominativo}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="azienda">
                          <Form.Label>Azienda in cui lavori</Form.Label>
                          <Form.Control
                            name="azienda"
                            value={values.azienda}
                            onChange={handleChange}
                            type="text"
                            placeholder="Rossi SpA"
                            isInvalid={errors.azienda}
                          />
                          <Form.Control.Feedback type="invalid">{errors.azienda}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="username">
                          <Form.Label>Nome utente che userai per accedere</Form.Label>
                          <Form.Control
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            type="text"
                            placeholder="mario.rossi"
                            isInvalid={errors.username}
                          />
                          <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="password">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Inserisci la tua password"
                            isInvalid={errors.password}
                          />
                          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="confermaPassword">
                          <Form.Label>Conferma password</Form.Label>
                          <Form.Control
                            name="confermaPassword"
                            value={values.confermaPassword}
                            onChange={handleChange}
                            type="password"
                            placeholder="Conferma la tua password"
                            isInvalid={errors.confermaPassword}
                          />
                          <Form.Control.Feedback type="invalid">{errors.confermaPassword}</Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="p-3">
                        <Button block type="submit" variant="primary" size="lg" className="text-uppercase" onClick={submit}>
                          Crea account
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
