import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ImageCard from "./image-card/ImageCard";

function CardSearchResults({ searchResults }) {
  return (
    <Container>
      <Row className="justify-content-between">
        {searchResults
          ? searchResults.map((result) => {
              return (
                <Col key={result.id} className="text-center mb-2">
                  <ImageCard cardData={result} />
                </Col>
              );
            })
          : "No Results"}
      </Row>
    </Container>
  );
}

export default CardSearchResults;
