import { createContext, useState, useRef, useEffect, useCallback } from "react";

import scryfall from "../../services/scryfall";

const CardSearchContext = createContext();

export const CardSearchProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState({});
  const [searchResults, setSearchResults] = useState();
  const [pagination, setPagination] = useState({
    per_page: 10,
    total_pages: 1,
    active_page: 1,
  });

  const controllerRef = useRef();
  const pageJumpRef = useRef();

  const submitNewSearch = (searchQuery) => {
    let newQuery = Object.fromEntries(
      Object.entries(searchQuery).filter(([, value]) => value && value !== "")
    );

    setCurrentSearch(() => ({ ...newQuery }));
    getCards(newQuery);
    setPagination((prevState) => ({ ...prevState, active_page: 1 }));
    pageJumpRef.current.value = 1;
  };

  const getCards = (searchObj = {}) => {
    console.log(searchObj);
    if (searchObj === {}) {
      return;
    }
    console.log("getCards fired");
    const searchString = createApiSearchStr(searchObj);
    setIsLoading(true);
    controllerRef.current && controllerRef.current.abort();
    // sets new AbortController
    controllerRef.current = new AbortController();
    scryfall
      .get(`/cards/search`, {
        params: { q: searchString },
        signal: controllerRef.current.signal,
      })
      .then((response) => {
        console.log(response);
        setSearchResults(response.data.data);
        return response;
      })
      .then((response) => {
        if (response.data.has_more) {
          getCardsNextPage(response.data.next_page);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setSearchResults({});
      })
      .finally(() => setIsLoading(false));
  };

  const getCardsNextPage = (pageUri) => {
    scryfall
      .get(pageUri)
      .then((response) => {
        console.log(response);
        setSearchResults((prevState) => [...prevState, ...response.data.data]);
        return response;
      })
      .then((response) => {
        console.log(response);
        if (response.data.has_more) getCardsNextPage(response.data.next_page);
      })
      .catch((error) => console.log(error.message));
  };

  const createApiSearchStr = (searchObj) => {
    let apiSearchArr = Object.entries(searchObj)
      .filter(([, value]) => value && value !== "")
      .map(([key, value]) => {
        switch (key) {
          case "card_name":
            return value;
          case "oracle_text":
            return `(${value
              .split(" ")
              .map((value) => `oracle:${value}`)
              .join(" ")})`;
          case "type_line":
            return `(${value
              .split(" ")
              .map((value) => `type:${value}`)
              .join(" ")})`;
          default:
            return "";
        }
      });
    console.log(apiSearchArr.join(" "));
    return apiSearchArr.join(" ");
  };

  //////// PAGINATION

  // // // updates pagination state when perPage option is changed
  const onPerPageChange = (event) => {
    setPagination((prevState) => ({
      ...prevState,
      per_page: event.target.value,
      active_page: 1,
    }));
  };

  const onPageEntry = (value, length) => {
    if (typeof value === "number" && value >= 1 && value <= length) {
      setPagination((prevState) => ({ ...prevState, active_page: value }));
    }
  };

  //////// PAGINATION
  // onClick handler for page number items (stored in pages = useState([]))
  const onPageClick = (event) => {
    window.stop();
    switch (event.target.closest(".page-link").dataset.navigate) {
      case "first-page":
        setPagination((prevState) => ({ ...prevState, active_page: 1 }));
        pageJumpRef.current.value = 1;
        break;
      case "prev-page":
        pagination.active_page > 1 &&
          setPagination((prevState) => ({ ...prevState, active_page: prevState.active_page - 1 }));
        pageJumpRef.current.value = pagination.active_page - 1;
        break;
      case "next-page":
        pagination.active_page < pagination.total_pages &&
          setPagination((prevState) => ({
            ...prevState,
            active_page: prevState.active_page + 1,
          }));
        pageJumpRef.current.value = pagination.active_page + 1;
        break;
      case "last-page":
        setPagination((prevState) => ({ ...prevState, active_page: prevState.total_pages }));
        pageJumpRef.current.value = pagination.total_pages;
        break;
      default:
        break;
    }
  };

  // // // Calculates total page numbers and creates page jsx
  // for loop creates page number jsx elements and pushes them to an empty array (newPages)
  // setPages state with new page jsx elements
  const updatePages = useCallback(() => {
    if (searchResults) {
      setPagination((prevState) => ({
        ...prevState,
        total_pages: Math.ceil(searchResults?.length / pagination.per_page),
      }));
    }
  }, [searchResults, pagination.per_page, setPagination]);

  // calls updatePages fn
  useEffect(() => {
    if (!Object.values(currentSearch).every((entry) => entry === "")) {
      updatePages();
    }
  }, [updatePages, currentSearch]);

  // END PROVIDER

  return (
    <CardSearchContext.Provider
      value={{
        currentSearch,
        isLoading,
        searchResults,
        controllerRef,
        pagination,
        pageJumpRef,
        setPagination,
        onPageClick,
        submitNewSearch,
        createApiSearchStr,
        onPageEntry,
        onPerPageChange,
      }}
    >
      {children}
    </CardSearchContext.Provider>
  );
};

export default CardSearchContext;
