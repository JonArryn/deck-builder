import React from "react";
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { ReactComponent as MtgLogo } from "../assets/mtg-pentagon.svg";
import CardSearchContext from "../context/cardSearch/CardSearchContext";

function Header() {
  const { submitNewSearch } = useContext(CardSearchContext);
  const [searchText, setSearchText] = useState({ card_name: "" });
  const navigate = useNavigate();

  return (
    <>
      <Navbar sticky="top" bg="dark" variant="dark" expand="md">
        <Container fluid className="p-3">
          <Navbar.Brand as={NavLink} to="/">
            <MtgLogo className="d-inline-block align-top" style={{ width: "30", height: "30" }} />{" "}
            MTG Deck Builder
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link to="/" as={NavLink}>
                Home
              </Nav.Link>
              <Nav.Link to="/cards/search" as={NavLink}>
                Card Search
              </Nav.Link>
              <Nav.Link to="/deck-manager" as={NavLink}>
                Deck Manager
              </Nav.Link>
              <Nav.Link to="/inventory" as={NavLink}>
                Inventory
              </Nav.Link>
              <Nav.Link to="/public-decks" as={NavLink}>
                Public Decks
              </Nav.Link>
            </Nav>
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                navigate(`/cards/search`);
                submitNewSearch(searchText);
                setSearchText({ card_name: "" });
              }}
            >
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search Cards..."
                  onChange={(event) => setSearchText({ card_name: event.target.value })}
                  value={searchText.card_name}
                />
                <Button className="btn btn-warning" type="submit" disabled={false}>
                  Search
                </Button>
              </InputGroup>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
