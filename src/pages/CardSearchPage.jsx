import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useIsMounted } from "../hooks/useIsMounted";
import scryfall from "../services/scryfall";
import Container from "react-bootstrap/Container";
import CardSearchResults from "../components/CardSearchResults";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

function CardSearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [searchSubmit, setSearchSubmit] = useState(false);
  const [searchResults, setSearchResults] = useState();
  const [responseFinished, setResponseFinished] = useState(false);

  const isMounted = useIsMounted();

  const submitSearch = () => {
    setSearchSubmit(false);
    setSearchParams({ q: searchText });
  };

  useEffect(() => {
    setIsLoading(true);
    scryfall
      .get(`/cards/search`, {
        params: { q: searchParams.get("q") },
      })
      .then((response) => {
        if (isMounted) {
          setSearchResults(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
        setSearchResults({});
      })
      .finally(setIsLoading(false), setResponseFinished(true));
  }, [isMounted, searchParams]);

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
      <Container className="py-5 w-25">
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
        >
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search Cards..."
              onChange={(event) => setSearchText(event.target.value)}
            />
            <Button className="btn btn-dark" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" /> : "Search"}
            </Button>
          </InputGroup>
        </Form>
      </Container>
      {searchResults && (
        <CardSearchResults searchResults={searchResults.data} />
      )}
    </>
  );
}

export default CardSearchPage;
