import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ImageCard from "./image-card/ImageCard";

function CardSearchResults({ searchResults }) {
  return (
    <Container
      className="bg-dark bg-opacity-50 p-5"
      style={{ borderRadius: "18px" }}
    >
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
