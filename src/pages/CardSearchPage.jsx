import React from "react";
// hooks
import { useState, useEffect, useRef, useContext } from "react";
// bootstrap
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
import Pagination from "react-bootstrap/Pagination";
import { ReactComponent as ChevronDown } from "../assets/chevron-double-down.svg";
import CardSearchContext from "../context/cardSearch/CardSearchContext";

//  //  TODOS // //
// implement pagination
// show active search form entries under search bar
// implement sorting
// toastify search errors
// implement grid table search option
// implement clear search fields and search params in url without a jarring affect on the user
// implement "back to most recent search" for any page in the app (localStorage?)
// implement remaining advanced search param options
// add helper text to advanced search fields
// add support for doublefaced cards
// add some text explaining how to use the search functions
// present empty state with a placeholder image to allow time for card loads (optional really)
// // // //

// // // pagination problem:
// need to set pagination search params when search queries are made
// if search comes from external source, default pagination params must be included
// pagination params must not be present in URL if no search has been made
// page search params must update with each form change in pagination component

// // // remove dependency from URL
// populate searchForm with currentSearch
// use URL to indicate searches from navigation bar

function CardSearchPage() {
  // CONTEXT
  const {
    isLoading,
    controllerRef,
    currentSearch,
    pagination,
    onPageClick,
    pageJumpRef,
    searchResults,
    submitNewSearch,
    onPageEntry,
    onPerPageChange,
  } = useContext(CardSearchContext);
  const [usingAdvanced, setUsingAdvanced] = useState(false);
  const [searchForm, setSearchForm] = useState({
    card_name: "",
    oracle_text: "",
    type_line: "",
  });

  // // // updates the searchForm state variable as values are entered based on form input ids // // //
  const onSearchEntry = (event) => {
    setSearchForm((prevState) => ({
      ...prevState,
      [event.target.dataset.field]: event.target.value,
    }));
  };
  // // //

  useEffect(() => {
    setSearchForm({ ...currentSearch });
  }, [currentSearch]);

  // // //  to cancel axios requests // // //
  // also sets ref for isMounted and returns on dismount
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    const abortController = controllerRef.current;
    return () => {
      isMountedRef.current = false;
      abortController && abortController.abort();
    };
  }, [controllerRef]);
  // // //

  //  //  //  Render
  return (
    <>
      <Container className="pt-5 pb-3 w-50">
        {/* Simple Search */}
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            submitNewSearch(searchForm);
          }}
        >
          <InputGroup className="mb-1">
            <FormControl
              placeholder={usingAdvanced ? "Using Advanced Search" : "Search Cards..."}
              onChange={onSearchEntry}
              disabled={isLoading || usingAdvanced}
              data-field="card_name"
              value={usingAdvanced ? "" : searchForm.card_name}
              required
            />
            <Button className="btn btn-dark" type="submit" disabled={isLoading || usingAdvanced}>
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
              submitNewSearch(searchForm);
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
        <Container className="mb-2">
          <Row className="justify-content-end g-3">
            <Col lg="auto" className="d-flex justify-content-sm-center align-self-end m-0 me-auto">
              <h4 className="text-light">Total Results {searchResults.length}</h4>
            </Col>
            <Col lg="auto" className="d-flex align-items-sm-center flex-column">
              <div className="text-light">Cards Per Page</div>
              <Form.Select
                size="sm"
                onChange={onPerPageChange}
                value={pagination.per_page}
                style={{ width: "115px" }}
                className="bg-dark text-light"
              >
                <option>10</option>
                <option>15</option>
                <option>20</option>
                <option>25</option>
              </Form.Select>
            </Col>

            <Col lg="auto" className="align-self-end d-flex justify-content-sm-center">
              <Pagination size="sm" className="mb-0">
                <Pagination.First
                  disabled={pagination.active_page === 1}
                  data-navigate="first-page"
                  onClick={(event) => onPageClick(event)}
                />
                <Pagination.Prev
                  disabled={pagination.active_page === 1}
                  data-navigate="prev-page"
                  onClick={(event) => onPageClick(event)}
                />
                <div className="bg-warning text-dark px-2">
                  <span className="align-middle">Page</span>
                </div>

                <FormControl
                  size="sm"
                  ref={pageJumpRef}
                  defaultValue={pagination.active_page}
                  onChange={(event) => onPageEntry(+event.target.value, pagination.total_pages)}
                  style={{ width: "40px" }}
                  className="bg-dark text-light border-warning"
                />
                <p className="bg-warning text-dark px-2 mb-0">
                  <span className="align-middle">of {pagination.total_pages}</span>
                </p>
                <Pagination.Next
                  disabled={pagination.active_page === pagination.total_pages}
                  data-navigate="next-page"
                  onClick={(event) => onPageClick(event)}
                />
                <Pagination.Last
                  disabled={pagination.active_page === pagination.total_pages}
                  data-navigate="last-page"
                  onClick={(event) => onPageClick(event)}
                />
              </Pagination>
            </Col>
          </Row>
        </Container>
      )}

      {searchResults && (
        <CardSearchResults
          searchResults={searchResults}
          activePage={pagination.active_page}
          resultsPerPage={pagination.per_page}
        />
      )}
    </>
  );
}

export default CardSearchPage;
