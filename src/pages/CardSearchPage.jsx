import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
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
  const urlSearchQuery = Object.fromEntries([...searchParams]);
  const [searchForm, setSearchForm] = useState(
    {
      card_name: urlSearchQuery.card_name,
      oracle_text: urlSearchQuery.oracle_text,
      type_line: urlSearchQuery.type_line,
    } || {}
  );
  const [searchResults, setSearchResults] = useState();

  //  //  //  exists to prevent infinite loops in useEffect functions
  const isNewSearchRef = useRef(true);
  const isMountedRef = useRef(false);
  const controllerRef = useRef();
  // // //

  // // //  to cancel axios requests // // //
  // also sets ref for isMounted and returns on dismount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      controllerRef.current && controllerRef.current.abort();
    };
  }, []);
  // // //

  // // // updates the searchForm state variable as values are entered based on form input ids // // //
  const onSearchEntry = (event) => {
    setSearchForm((prevState) => ({
      ...prevState,
      [event.target.dataset.field]: event.target.value,
    }));
  };
  // // //

  // upon form submission, submitSearchForm creates my own search params and sets them in the URL // // //
  // calls get cards to fetch API data
  // only fires from form buttons on the component
  const submitSearchForm = () => {
    let newParams = {};
    isNewSearchRef.current = true;
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
  const createApiSearchStr = useCallback((search = "") => {
    let apiSearchArr = [];

    if (search && search !== "") {
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
    }
    return apiSearchArr.join(" ");
  }, []);
  // // //

  // // // fetches seach results from API // // //
  // takes in search string created by the createApiSearchStr function
  const getCards = useCallback((searchString) => {
    if (searchString && searchString !== "") {
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
    }
  }, []);
  // // //

  // // // detect if search came from external component and set search params // // //
  // only fires if a search came from external component
  // external search components insert a search param into the url: external=true -->
  // this is because the other useEffect only runs on mount and will not run while external:true is in the urlSearchQuery -->
  // sets isNewSearchRef useRef to true in case user uses external search component while searchPage component is mounted -->
  // deletes the external search param from urlSearchQuery -->
  // sets new URL searchParams so that external=true is removed
  useEffect(() => {
    if (urlSearchQuery.external) {
      delete urlSearchQuery.external;
      setSearchParams({
        ...urlSearchQuery,
      });
      setSearchForm((prevState) => ({
        ...prevState,
        ...urlSearchQuery,
      }));
      isNewSearchRef.current = true;
    }
  }, [urlSearchQuery, setSearchParams]);
  // // //

  // // // get search results on page load // // //
  // only runs if: isNewSearchRef useRef is true --> urlSeachQuery object as entries --> external:true is not in urlSearchQuery
  // runs getCards with createApiSearchStr(urlSearchQuery) passed in to get the string returned and call the API
  // sets isNewSearchRef to false to prevent infinite loops
  useEffect(() => {
    if (
      isNewSearchRef.current &&
      Object.keys(urlSearchQuery) !== 0 &&
      !urlSearchQuery.external
    ) {
      getCards(createApiSearchStr(urlSearchQuery));
    }
    isNewSearchRef.current = false;
  }, [getCards, createApiSearchStr, urlSearchQuery]);
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
                      value={searchForm.oracle_text}
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
