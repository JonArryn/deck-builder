import React from "react";
import { Container, Row, Col, ListGroup, Spinner } from "react-bootstrap";
import scryfall from "../services/scryfall";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function CardDetailPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState({});

  const params = useParams();
  const { cardId } = params;

  useEffect(() => {
    const getCardById = (id) => {
      scryfall
        .get(`/cards/${id}`)
        .then((response) => setCardData(response))
        .then(() => setIsLoading(false))
        .catch((error) => console.log(error));
    };
    getCardById(cardId);
  }, [isLoading, cardId]);

  if (isLoading) {
    return (
      <Container className="text-center align-middle">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="mt-5">
        <Row className="text-center g-4">
          <Col className="col-md">
            <img
              src={cardData.data.image_uris.normal}
              alt="magic card"
              className="img-fluid"
              style={{ maxWidth: "25rem", borderRadius: "18px" }}
            />
          </Col>
          <Col className="col-md">
            <ListGroup>
              <ListGroup.Item>Card Name: {cardData.data.name}</ListGroup.Item>
              <ListGroup.Item>
                Mana Cost: {cardData.data.mana_cost}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CardDetailPage;
