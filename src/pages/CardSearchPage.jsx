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
  const [searchQuery, setSearchQuery] = useState({
    cardName: "",
    oracleText: "",
    typeLine: "",
  });
  const [searchResults, setSearchResults] = useState();
  const [open, setOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // implement axios cancel requests if search is in progress and on unmount
  // present empty state with a placeholder image

  const submitSearch = () => {
    if (searchParams) {
      setSearchParams({ q: searchText });
    }
  };

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

  // updates the searchQuery state variable as values are entered based on form input ids
  const onAdvancedChange = (event) => {
    setSearchQuery((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
    onAdvancedSubmit();
  };

  // iterates over the searchQuery state variable to mutate its data into useable search string
  // example search query string 'goblin (oracle:fire oracle: goblin)'
  const onAdvancedSubmit = () => {
    let searchString = [];
    console.log(searchString);
    Object.entries(searchQuery).map((entry) => {
      if (entry[1]) {
        switch (entry[0]) {
          case "cardName":
            searchString.push(entry[1]);
            break;
          case "oracleText":
            searchString.push(entry[1]);
            break;
          default:
        }
      }
    });
    console.log(searchString);
  };

  return (
    <>
      <Container className="pt-5 pb-3 w-50">
        {/* Simple Search */}
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
        >
          <InputGroup className="mb-1">
            <FormControl
              placeholder={open ? "Using Advanced Search" : "Search Cards..."}
              onChange={(event) => setSearchText(event.target.value)}
              value={searchText}
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
          <Form id="advanced-search">
            <Row>
              <Col>
                <Form.Group as={Row} className="mb-3" controlId="cardName">
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
                <Form.Group as={Row} className="mb-3" controlId="oracleText">
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
            <Form.Group as={Row} className="mb-3" controlId="typeLine">
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
            <fieldset>
              <Form.Group as={Row} className="mb-3">
                <Form.Label as="legend" column sm={2}>
                  Radios
                </Form.Label>
                <Col sm={10}>
                  <Form.Check
                    type="radio"
                    label="first radio"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios1"
                  />
                  <Form.Check
                    type="radio"
                    label="second radio"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios2"
                  />
                  <Form.Check
                    type="radio"
                    label="third radio"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios3"
                  />
                </Col>
              </Form.Group>
            </fieldset>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formHorizontalCheck"
            >
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check label="Remember me" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type="submit">Sign in</Button>
              </Col>
            </Form.Group>
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
