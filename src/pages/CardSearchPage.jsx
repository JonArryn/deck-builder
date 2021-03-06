import React from "react";
// hooks
import { useState, useEffect, useRef, useContext } from "react";
// bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardSearchResults from "../components/CardSearchResults";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import Offcanvas from "react-bootstrap/Offcanvas";
import CardSearchContext from "../context/cardSearch/CardSearchContext";

//  //  TODOS // //
// show active search form entries under search bar
// implement sorting
// set timeout after editing page jump
// toastify search errors
// implement grid table search option
// implement "back to most recent search" for any page in the app (localStorage?)
// implement remaining advanced search param options
// add helper text to advanced search fields
// add support for doublefaced cards
// add some text explaining how to use the search functions
// present empty state with a placeholder image to allow time for card loads (optional really)
// // // //

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

  // advanced off-canvas
  const [usingAdvanced, setUsingAdvanced] = useState(false);
  const handleClose = () => setUsingAdvanced(false);
  const handleShow = () => setUsingAdvanced(true);
  const [submitBtnDisable, setSubmitBtnDisable] = useState(true);

  // local state
  const [searchForm, setSearchForm] = useState({
    card_name: "",
    oracle_text: "",
    type_line: "",
    converted_mana_cost: "",
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

  useEffect(() => {
    setSubmitBtnDisable(() => Object.values(searchForm).every((entry) => entry === ""));
  }, [searchForm]);

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
              value={usingAdvanced ? "" : searchForm.card_name || ""}
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
            onClick={handleShow}
            variant="outline-warning"
            className="text-light"
            aria-controls="advanced-search"
          >
            Use Advanced Search
          </Button>
        </div>
      </Container>
      <Offcanvas show={usingAdvanced} onHide={handleClose} className="bg-dark text-light">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Advanced Search</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form
            id="advanced-search"
            onSubmit={(event) => {
              event.preventDefault();
              submitNewSearch(searchForm);
            }}
          >
            <Form.Group className="mb-2">
              <Form.Label>Card Name</Form.Label>
              <Form.Control
                data-field="card_name"
                type="text"
                placeholder="Enter Card Name"
                value={searchForm.card_name || ""}
                onChange={onSearchEntry}
              />

              <Form.Text className="text-warning">
                <small>Any word the card name contains</small>
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Oracle Text</Form.Label>
              <Form.Control
                data-field="oracle_text"
                type="text"
                placeholder="Abilities/Keywords etc."
                value={searchForm.oracle_text || ""}
                onChange={onSearchEntry}
              />
              <Form.Text className="text-warning">
                <small>Any text found in the text box of the card</small>
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Type Line</Form.Label>
              <Form.Control
                data-field="type_line"
                type="text"
                placeholder="Type/Tribe"
                value={searchForm.type_line || ""}
                onChange={onSearchEntry}
              />
              <Form.Text className="text-warning">
                <small>Can include type, sub/super-type, tribe etc.</small>
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Converted Mana Cost</Form.Label>

              <Form.Control
                data-field="converted_mana_cost"
                type="number"
                placeholder="Card CMC"
                value={searchForm.converted_mana_cost || ""}
                onChange={onSearchEntry}
              />
              <Form.Text className="text-warning">
                <small>Total mana cost to cast the spell</small>
              </Form.Text>
            </Form.Group>

            <Stack direction="horizontal" className="justify-content-center" gap={3}>
              <Button
                variant="success"
                type="submit"
                disabled={isLoading || submitBtnDisable}
                onClick={handleClose}
              >
                {isLoading ? <Spinner animation="border" /> : "Submit Search"}
              </Button>
              <div className="vr text-light"></div>
              <Button
                variant="danger"
                onClick={() => {
                  setSearchForm(() => ({
                    card_name: "",
                    oracle_text: "",
                    type_line: "",
                    converted_mana_cost: "",
                  }));
                }}
              >
                Clear
              </Button>
            </Stack>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      {searchResults && (
        <Container className="mb-2">
          <Row className="justify-content-end g-3">
            <Col lg="auto" className="d-flex justify-content-sm-center align-self-end m-0 me-auto">
              <Badge bg="warning" className="text-dark">
                <h6 className="m-1">Total Results {searchResults.length}</h6>
              </Badge>
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
              <Stack direction="horizontal" size="sm" className="m-0">
                <Button
                  size="sm"
                  variant="dark"
                  disabled={pagination.active_page === 1}
                  data-navigate="first-page"
                  onClick={(event) => onPageClick(event)}
                  className="border-light"
                >
                  &laquo;
                </Button>
                <Button
                  size="sm"
                  variant="dark"
                  disabled={pagination.active_page === 1}
                  data-navigate="prev-page"
                  onClick={(event) => onPageClick(event)}
                  className="border-light"
                >
                  &lsaquo;
                </Button>
                <div className="bg-warning text-dark px-2 h-100 rounded">
                  <span className="align-middle">Page</span>
                </div>

                <FormControl
                  size="sm"
                  ref={pageJumpRef}
                  defaultValue={pagination.active_page}
                  onChange={(event) => onPageEntry(+event.target.value, pagination.total_pages)}
                  style={{ width: "40px" }}
                  className="bg-dark text-light border-light"
                />
                <div className="bg-warning text-dark px-2 mb-0 h-100 rounded">
                  <span className="align-middle">of {pagination.total_pages}</span>
                </div>
                <Button
                  size="sm"
                  variant="dark"
                  disabled={pagination.active_page === pagination.total_pages}
                  data-navigate="next-page"
                  onClick={(event) => onPageClick(event)}
                  className="border-light"
                >
                  &rsaquo;
                </Button>
                <Button
                  size="sm"
                  variant="dark"
                  disabled={pagination.active_page === pagination.total_pages}
                  data-navigate="last-page"
                  onClick={(event) => onPageClick(event)}
                  className="border-light"
                >
                  &raquo;
                </Button>
              </Stack>
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
