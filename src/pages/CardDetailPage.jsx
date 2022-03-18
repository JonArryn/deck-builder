import React from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import scryfall from "../services/scryfall";
import LegalityTable from "../components/card-data/LegalityTable";
import CardDetailTable from "../components/card-data/CardDetailTable";
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
    <Container className="mt-5">
      <Row className="align-items-center justify-content-around bg-dark bg-opacity-50 p-3">
        <Col className="text-center">
          <img
            src={cardData.data.image_uris.normal}
            alt="magic card"
            className="img-fluid shadow-lg"
            style={{
              maxWidth: "350px",
              borderRadius: "18px",
            }}
          />
        </Col>
        <Col>
          <CardDetailTable cardData={cardData} />
        </Col>
        <Col>
          <LegalityTable legalities={cardData.data.legalities} />
        </Col>
      </Row>
    </Container>
  );
}

export default CardDetailPage;
