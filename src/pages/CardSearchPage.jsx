import React from "react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
// import axios from "axios";
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
// implement pagination
// implement sorting
// implement grid table search option
// implement clear search fields and search params in url without a jarring affect on the user
// implement "back to most recent search" for any page in the app (localStorage?)
// implement remaining advanced search param options
// add helper text to advanced search fields
// add support for doublefaced cards
// add some text explaining how to use the search functions
// present empty state with a placeholder image to allow time for card loads (optional really)
// // // //

function CardSearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [usingAdvanced, setUsingAdvanced] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = useMemo(
    () => ({
      card_name: searchParams.get("card_name") || "",
      oracle_text: searchParams.get("oracle_text") || "",
      type_line: searchParams.get("type_line") || "",
    }),
    [searchParams]
  );
  const [searchForm, setSearchForm] = useState({ ...urlSearchQuery });
  const [searchResults, setSearchResults] = useState();

  // // // updates the searchForm state variable as values are entered based on form input ids // // //
  const onSearchEntry = (event) => {
    setSearchForm((prevState) => ({
      ...prevState,
      [event.target.dataset.field]: event.target.value,
    }));
  };
  // // //

  // Sets new search params upon submission // // //
  // creates array from searchForm object --> maps to skip over null entries -->
  // sets new searchParams with valid form entries
  const submitSearchForm = () => {
    let newParams = {};
    Object.entries(searchForm).map((entry) => {
      if (entry[1]) {
        newParams[entry[0]] = entry[1];
      }
      return entry;
    });
    setSearchParams({
      ...newParams,
    });
  };
  // // //

  // // // creates a search string to submit to the API and returns it // // //
  // iterates over an object that is passed into it -->
  // pushes the object entries into an array -->
  // returns string
  const createApiSearchStr = (search = "") => {
    let apiSearchArr = [];

    Object.entries(search).map((entry) => {
      if (entry[1]) {
        switch (entry[0]) {
          case "card_name":
            apiSearchArr.push(entry[1]);
            break;
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
    return apiSearchArr.join(" ");
  };
  // // //

  // // // fetches seach results from API // // //
  // takes in search object -->
  // passes to createApiSearchStr to get search string to submit to API
  // controls isLoading and AbortController
  const getCards = useCallback((searchObj = "") => {
    const searchString = createApiSearchStr(searchObj);
    setIsLoading(true);
    controllerRef.current && controllerRef.current.abort();
    // sets new AbortController
    controllerRef.current = new AbortController();
    scryfall
      .get(`/cards/search?q=${searchString}`, {
        signal: controllerRef.current.signal,
      })
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.log(error.message);
        setSearchResults({});
      })
      .finally(() => setIsLoading(false));
  }, []);
  // // //

  // // //  to cancel axios requests // // //
  // also sets ref for isMounted and returns on dismount
  const isMountedRef = useRef(false);
  const controllerRef = useRef();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      controllerRef.current && controllerRef.current.abort();
    };
  }, []);
  // // //

  // // // get search results on page load // // //
  // only runs if: urlSearchQuery has values
  // runs getCards with urlSearchQuery passed in
  useEffect(() => {
    if (!Object.values(urlSearchQuery).every((entry) => entry === "")) {
      getCards(urlSearchQuery);
      setSearchForm(() => ({ ...urlSearchQuery }));
    }
  }, [urlSearchQuery, getCards]);
  // // //

  //  //  //  Render
  return (
    <>
      <Container className="pt-5 pb-3 w-50">
        {/* Simple Search */}
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            submitSearchForm();
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
              value={usingAdvanced ? "" : searchForm.card_name}
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
              submitSearchForm();
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
                      value={searchForm.card_name}
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
                      data-field="oracle_text"
                      type="text"
                      placeholder="Any text found in the rules box"
                      value={searchForm.oracle}
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
                  value={searchForm.type_line}
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
