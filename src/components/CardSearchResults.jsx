import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ImageCard from "./image-card/ImageCard";

function CardSearchResults({ activePage, resultsPerPage, searchResults }) {
  return (
    <>
      <Container className="bg-dark bg-opacity-50 p-5" style={{ borderRadius: "18px" }}>
        {searchResults.length ? (
          <Row className="justify-content-between">
            {searchResults
              ? searchResults
                  .slice(activePage * resultsPerPage - resultsPerPage, activePage * resultsPerPage)
                  .map((result) => {
                    return (
                      <Col key={result.id} className="text-center mb-2">
                        <ImageCard cardData={result} />
                      </Col>
                    );
                  })
              : "No Results"}
          </Row>
        ) : (
          "No Results"
        )}
      </Container>
    </>
  );
}

export default CardSearchResults;
