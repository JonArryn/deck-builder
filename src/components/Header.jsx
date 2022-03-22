import React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { ReactComponent as MtgLogo } from "../assets/mtg-pentagon.svg";

function Header() {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md">
        <Container fluid className="p-3">
          <Navbar.Brand as={NavLink} to="/">
            <MtgLogo
              className="d-inline-block align-top"
              style={{ width: "30", height: "30" }}
            />{" "}
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
                navigate(`/cards/search?card_name=${searchText}`);
                setSearchText("");
              }}
            >
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search Cards..."
                  onChange={(event) => setSearchText(event.target.value)}
                  value={searchText}
                />
                <Button
                  className="btn btn-warning"
                  type="submit"
                  disabled={false}
                >
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
