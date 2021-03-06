import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CardSearchPage from "./pages/CardSearchPage";
import CardDetailPage from "./pages/CardDetailPage";

import { CardSearchProvider } from "./context/cardSearch/CardSearchContext";

function App() {
  return (
    <CardSearchProvider>
      <Router>
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cards/search" element={<CardSearchPage />} />
          <Route path={`/cards/:cardId`} element={<CardDetailPage />} />
        </Routes>
      </Router>
    </CardSearchProvider>
  );
}

export default App;
