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

//  //  TO DOS // //
// implement axios cancel requests if is in progress and on unmount
// present empty state with a placeholder image to allow time for card loads (optional really)
// implement clear search fields and search params in url without a jarring affect on the user
// implement remaining advanced search param options
// update search text under simple search box field
// implement pagination

function CardSearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [usingAdvanced, setUsingAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    card_name: "",
    oracle: "",
    type_line: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState();

  // submits search query to scryfall API when searchParams are set
  useEffect(() => {
    // checks to ensure there is an actual query in the URL search params
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
  const onSearchEntry = (event) => {
    setSearchQuery((prevState) => ({
      ...prevState,
      [event.target.dataset.field]: event.target.value,
    }));
  };

  // iterates over the searchQuery state variable to mutate its data into useable search string
  // example search query string 'goblin (oracle:fire oracle:goblin) (type:creature type:artifact)'
  const createSearchString = () => {
    let searchString = "";
    Object.entries(searchQuery).map((entry) => {
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
                .replaceAll(" ", " type:");

              searchString += ` ${typeText}`;
            }
            break;
          default:
        }
      }
      // is there a way to avoid this double return?
      return searchString;
    });
    return searchString;
  };

  return (
    <>
      <Container className="pt-5 pb-3 w-50">
        {/* Simple Search */}
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            setSearchParams({ q: createSearchString() });
          }}
        >
          <InputGroup className="mb-1">
            <FormControl
              placeholder={
                usingAdvanced ? "Using Advanced Search" : "Search Cards..."
              }
              onChange={onSearchEntry}
              disabled={isLoading || usingAdvanced}
              data-field="card_name"
              // \/ \/ oohh clever
              value={usingAdvanced ? "" : searchQuery.card_name}
              required
            />
            <Button
              className="btn btn-dark"
              type="submit"
              disabled={isLoading || usingAdvanced}
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
        className="mb-3 w-75 text-light border-warning pb-2"
        style={{ borderRadius: "18px" }}
      >
        <div className="text-center py-3">
          <Button
            onClick={() => {
              setUsingAdvanced(!usingAdvanced);
            }}
            variant="outline-warning"
            className="text-light"
            aria-controls="advanced-search"
            aria-expanded={usingAdvanced}
          >
            Advanced Search <ChevronDown />
          </Button>
        </div>

        <Collapse
          in={usingAdvanced}
          className="my-3 p-3 bg-dark bg-opacity-50"
          style={{ borderRadius: "12px" }}
        >
          <Form
            id="advanced-search"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchParams({ q: createSearchString() });
            }}
          >
            <Row>
              <Col>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>
                    Card Name
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      data-field="card_name"
                      type="text"
                      placeholder="Any word the card name contains"
                      onChange={onSearchEntry}
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>
                    Oracle Text
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      data-field="oracle"
                      type="text"
                      placeholder="Any text found in the rules box"
                      onChange={onSearchEntry}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Type Line
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  data-field="type_line"
                  type="text"
                  placeholder="Any text found in the rules box"
                  onChange={onSearchEntry}
                />
              </Col>
            </Form.Group>
            <div className="text-center">
              <Button variant="success" type="submit" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" /> : "Submit Search"}
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
