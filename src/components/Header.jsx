import React from "react";
import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { ReactComponent as MtgLogo } from "../assets/mtg-pentagon.svg";

function Header() {
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
              <Nav.Link to="/cards" as={NavLink}>
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
