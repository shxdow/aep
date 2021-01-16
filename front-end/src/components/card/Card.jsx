import React, { useCallback } from 'react';
import { Card, Row, Col, FormControl, Button, ButtonGroup } from 'react-bootstrap';

const CardElenco = ({
  children,
  title,
  subtitle,
  onCreate,
  onEdit,
  onDelete,
  buttonsEnabled,
  search,
  onSearchChange,
}) => {
  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <Card>
      <Card.Body>
        <Row className="mb-3">
          <Col xl="6" lg="6" md="6" sm="12">
            <Card.Title className="text-gray-900">{title}</Card.Title>
            <Card.Subtitle>{subtitle}</Card.Subtitle>
          </Col>
          <Col xl="6" lg="6" md="6" sm="12">
            <Row>
              <Col style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <ButtonGroup>
                  {onDelete && (
                    <Button
                      variant="outline-danger"
                      disabled={!buttonsEnabled}
                      onClick={onDelete}
                    >
                      Elimina
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      data-testid="edit-button"
                      variant="outline-primary"
                      disabled={!buttonsEnabled}
                      onClick={onEdit}
                    >
                      Modifica
                    </Button>
                  )}
                  <Button
                    data-testid="create-button"
                    variant="outline-primary"
                    onClick={onCreate}
                  >
                    Crea
                  </Button>
                </ButtonGroup>
              </Col>
              <Col>
                <FormControl
                  placeholder="Filtra..."
                  value={search}
                  onChange={handleSearchChange}
                  style={{ minWidth: 200 }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        {children}
      </Card.Body>
    </Card>
  );
};

export default CardElenco;
