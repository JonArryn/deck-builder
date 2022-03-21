import React from "react";
import { useState, useEffect, useCallback } from "react";
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

//  //  TODOS // //
// re-create search query and pull data into state from search query
// populate fields with search query param data
// separate setStates for regular and advanced searches
// implement axios cancel requests if is in progress and on unmount
// present empty state with a placeholder image to allow time for card loads (optional really)
// implement clear search fields and search params in url without a jarring affect on the user
// implement remaining advanced search param options
// update search text under simple search box field
// add helper text to advanced search fields
// change route to cards/search
// add support for doublefaced cards
// implement pagination
// implement sorting
// implement grid table search option
// add some text explaining how to use the search functions
// // // //

function CardSearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [usingAdvanced, setUsingAdvanced] = useState(false);
  const [simpleQuery, setSimpleQuery] = useState({ card_name: "" });
  const [advancedQuery, setAdvancedQuery] = useState({
    oracle: "",
    type_line: "",
  });
  const [searchSubmit, setSearchSubmit] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState();

  // get cards takes state data for search query and makes mutates it into a string that's usable by the API
  // after which an axios GET request is sent to the API /cards/search endpoint using that string
  const getCards = useCallback(() => {
    let apiSearchArr = [];
    // checks if simpleQuery.card_name is not an empty string, if not it pushes to the array
    // simpleQuery.card_name is set by the useEffect hook down below getCards

    // // // THIS is where the bug is showing itself, when this function runs, simpleQuery.card_name is still "" - but it is in the state, so something about the asynchronous behavior of state is not making the state available by the time this function runs // // //
    if (simpleQuery.card_name !== "") {
      apiSearchArr.push(simpleQuery.card_name);
    }
    // loops over entries in advancedQuery and pushes them to apiSearchArr
    Object.entries(advancedQuery).map((entry) => {
      if (entry[1]) {
        switch (entry[0]) {
          case "oracle_text":
            apiSearchArr.push(
              `(oracle:${entry[1]})`.replaceAll(" ", " oracle:")
            );
            break;
          case "type_line":
            apiSearchArr.push(`(type:${entry[1]})`.replaceAll(" ", " type:"));
            break;
          default:
            break;
        }
      }
      return entry;
    });
    setIsLoading(true);
    // API get request. apiSearchArr is joined with spaces which is what the API needs
    scryfall
      .get(`/cards/search?q=${apiSearchArr.join(" ")}`)
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.log(error);
        setSearchResults({});
      })
      .finally(() => setIsLoading(false));
  }, [advancedQuery, simpleQuery]);

  useEffect(() => {
    // if statement guard clause only runs use effect if there is a search query and searchSubmit state variable is true to prevent infinite loops
    if (searchParams.get("query") && searchSubmit) {
      // sets simpleQuery.card_name with the card_name searchParam
      setSimpleQuery({ card_name: searchParams.get("card_name") });
      getCards();
      setSearchSubmit(false);
    }
  }, [searchParams, searchSubmit, getCards]);

  // updates the advancedQuery state variable as values are entered based on form input ids
  const onSearchEntry = (event) => {
    setAdvancedQuery((prevState) => ({
      ...prevState,
      [event.target.dataset.field]: event.target.value,
    }));
  };

  // upon form submission, submitSearchQuery creates my own search params and sets them in the URL
  const submitSearchQuery = () => {
    let newParams = {};
    if (simpleQuery.card_name) {
      newParams["card_name"] = simpleQuery.card_name;
    }
    Object.entries(advancedQuery).map((entry) => {
      if (entry[1]) {
        newParams[entry[0]] = entry[1];
      }
      return entry;
    });
    setSearchParams({
      query: true,
      ...newParams,
    });
    // sets searchSubmit state variable to true so that the useEffect hook above will run
    setSearchSubmit(true);
  };

  return (
    <>
      <Container className="pt-5 pb-3 w-50">
        {/* Simple Search */}
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            submitSearchQuery();
          }}
        >
          <InputGroup className="mb-1">
            <FormControl
              placeholder={
                usingAdvanced ? "Using Advanced Search" : "Search Cards..."
              }
              onChange={(event) => {
                setSimpleQuery({ card_name: event.target.value });
              }}
              disabled={isLoading || usingAdvanced}
              data-field="card_name"
              // \/ \/ oohh clever
              value={usingAdvanced ? "" : simpleQuery.card_name}
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
              submitSearchQuery();
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
                      value={simpleQuery.card_name}
                      onChange={(event) =>
                        setSimpleQuery({ card_name: event.target.value })
                      }
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
                      value={advancedQuery.oracle}
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
                  value={advancedQuery.type_line}
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
