import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from "react-bootstrap/Container";
import CardSearchPage from "./pages/CardSearchPage";
import CardDetailPage from "./pages/CardDetailPage";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cards" element={<CardSearchPage />} />
          <Route path="/cards/:cardId" element={<CardDetailPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
