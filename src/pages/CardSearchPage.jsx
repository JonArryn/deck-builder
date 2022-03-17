import React from "react";
import { useState, useEffect } from "react";
import { useIsMounted } from "../hooks/useIsMounted";
import scryfall from "../services/scryfall";
import Container from "react-bootstrap/Container";
import CardSearchResults from "../components/CardSearchResults";
import {
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Spinner,
} from "react-bootstrap";

function CardSearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchSubmit, setSearchSubmit] = useState(false);
  const [searchResults, setSearchResults] = useState();

  const isMounted = useIsMounted();

  useEffect(() => {
    const submitSearch = async () => {
      setIsLoading(true);
      try {
        const response = await scryfall.get(`/cards/search`, {
          params: { q: searchText },
        });
        if (isMounted) {
          setSearchResults(response.data);
        }
        console.log(response.data);
      } catch (error) {
        console.log(error);
        setSearchResults({});
      }
      setIsLoading(false);
      setSearchSubmit(false);
    };

    searchSubmit && submitSearch();
  }, [searchSubmit, searchText, isMounted]);

  // const submitSearch = async (searchQuery) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await scryfall.get(`/cards/search`, {
  //       params: { q: searchQuery },
  //     });
  //     setSearchResults(response.data);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //     setSearchResults({});
  //   }
  //   setIsLoading(false);
  // };

  // const submitSearch = async (searchQuery) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await scryfall.get(`/cards/search`, {
  //       params: { q: searchQuery },
  //     });
  //     setSearchResults(response.data);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //     setSearchResults({});
  //   }
  //   setIsLoading(false);
  // };

  return (
    <>
      <Container className="py-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSearchSubmit(true);
          }}
        >
          <InputGroup className="mb-3 container-sm">
            <FormControl
              placeholder="Search Cards..."
              onChange={(event) => setSearchText(event.target.value)}
            />
            <Button className="btn btn-dark" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" /> : "Search"}
            </Button>
          </InputGroup>
        </form>
      </Container>
      {searchResults && (
        <CardSearchResults searchResults={searchResults.data} />
      )}
    </>
  );
}

export default CardSearchPage;
