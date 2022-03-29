import React from "react";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import ImageCard from "./image-card/ImageCard";

function CardSearchResults({ searchResults }) {
  // const [resultCount, setResultCount] = useState();
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);
  // const [totalPages, setTotalPages] = useState();
  // console.log(searchResults);

  let resultCount = 0;

  let totalPages = Math.ceil(resultCount / resultsPerPage);

  let pages = [];
  for (let number = 1; number <= totalPages; number++) {
    pages.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        data-page={number}
        onClick={(event) => {
          setActivePage(+event.target.dataset.page);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {}, []);

  return (
    <>
      <Container>
        <Row className="justify-content-between align-items-center mb-2">
          <Col xs lg={2}>
            <div className="text-light">Cards Per Page</div>
            <Form.Select
              size="sm"
              onChange={(event) => setResultsPerPage(+event.target.value)}
            >
              <option>10</option>
              <option>15</option>
              <option>20</option>
              <option>25</option>
            </Form.Select>
          </Col>
          <Col xs lg={4}>
            <div>Pages</div>
            <Pagination size="sm" className="mb-0">
              {pages.map((page) => page)}
            </Pagination>
          </Col>
        </Row>
      </Container>
      <Container
        className="bg-dark bg-opacity-50 p-5"
        style={{ borderRadius: "18px" }}
      >
        <Row className="justify-content-between">
          {searchResults
            ? searchResults
                .slice(
                  activePage * resultsPerPage - resultsPerPage,
                  activePage * resultsPerPage
                )
                .map((result) => {
                  return (
                    <Col key={result.id} className="text-center mb-2">
                      <ImageCard cardData={result} />
                    </Col>
                  );
                })
            : "No Results"}
        </Row>
      </Container>
    </>
  );
}

export default CardSearchResults;
