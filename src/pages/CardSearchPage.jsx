import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import scryfall from "../services/scryfall";
import Container from "react-bootstrap/Container";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardSearchResults from "../components/CardSearchResults";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { ReactComponent as ChevronDown } from "../assets/chevron-double-down.svg";

function CardSearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [advancedQuery, setAdvancedQuery] = useState({
    card_name: "",
    oracle: "",
    type_line: "",
  });
  const [searchResults, setSearchResults] = useState();
  const [open, setOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // implement axios cancel requests if search is in progress and on unmount
  // present empty state with a placeholder image

  useEffect(() => {
    if (searchParams.get("q")) {
      setIsLoading(true);
      scryfall
        .get(`/cards/search`, {
          params: { q: searchParams.get("q") },
        })
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) => {
          console.log(error);
          setSearchResults({});
        })
        .finally(() => setIsLoading(false));
    }
  }, [searchParams]);

  // updates the advancedQuery state variable as values are entered based on form input ids
  const onAdvancedChange = (event) => {
    setAdvancedQuery((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
    // iterates over the advancedQuery state variable to mutate its data into useable search string
    // example search query string 'goblin (oracle:fire oracle:goblin)'
    let searchString = "";
    // console.log(searchString);
    Object.entries(advancedQuery).map((entry) => {
      if (entry[1]) {
        switch (entry[0]) {
          case "card_name":
            searchString += entry[1];
            break;
          case "oracle":
            {
              let newString = "";
              let oracleText = newString
                .concat("(oracle:", entry[1], ")")
                .replaceAll(" ", " oracle:");

              searchString += ` ${oracleText}`;
            }
            break;
          case "type_line":
            {
              let newString = "";
              let typeText = newString
                .concat("(type:", entry[1], ")")
                .replaceAll(" ", " oracle:");

              searchString += ` ${typeText}`;
            }
            break;
          default:
        }
      }
      return setSearchText(() => searchString);
    });
  };

  return (
    <>
      <Container className="pt-5 pb-3 w-50">
        {/* Simple Search */}
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            setSearchParams({ q: searchText });
          }}
        >
          <InputGroup className="mb-1">
            <FormControl
              placeholder={open ? "Using Advanced Search" : "Search Cards..."}
              onChange={(event) => setSearchText(event.target.value)}
              disabled={isLoading || open}
              required
            />
            <Button
              className="btn btn-dark"
              type="submit"
              disabled={isLoading || open}
            >
              {isLoading ? <Spinner animation="border" /> : "Search"}
            </Button>
          </InputGroup>
          <Form.Text className="text-light">
            {searchParams.get("q") === null
              ? ""
              : `Simple Card Search: ${searchParams.get("q")}`}
          </Form.Text>
        </Form>
      </Container>

      {/* Advanced Search */}

      <Container
        className="mb-3 w-75 bg-dark bg-opacity-50 text-light border-warning pb-2"
        style={{ borderRadius: "18px" }}
      >
        <div className="text-center py-3">
          <Button
            onClick={() => {
              setOpen(!open);
              setSearchText("");
            }}
            variant="outline-warning"
            className="text-light"
            aria-controls="advanced-search"
            aria-expanded={open}
          >
            Advanced Search <ChevronDown />
          </Button>
        </div>

        <Collapse in={open} className="my-3">
          <Form
            id="advanced-search"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchParams({ q: searchText });
            }}
          >
            <Row>
              <Col>
                <Form.Group as={Row} className="mb-3" controlId="card_name">
                  <Form.Label column sm={2}>
                    Card Name
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Any word the card name contains"
                      onChange={onAdvancedChange}
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group as={Row} className="mb-3" controlId="oracle">
                  <Form.Label column sm={2}>
                    Oracle Text
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Any text found in the rules box"
                      onChange={onAdvancedChange}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group as={Row} className="mb-3" controlId="type_line">
              <Form.Label column sm={2}>
                Type Line
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="Any text found in the rules box"
                  onChange={onAdvancedChange}
                />
              </Col>
            </Form.Group>
            <div className="text-center">
              <Button variant="success" type="submit">
                Submit Search
              </Button>
            </div>
          </Form>
        </Collapse>
      </Container>

      {searchResults && (
        <CardSearchResults searchResults={searchResults.data} />
      )}
    </>
  );
}

export default CardSearchPage;
