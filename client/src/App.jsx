import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/NavBar";
import LandingPage from "./pages/LandingPage.jsx";
import PlayingMenu from "./pages/PlayMenu.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import SinglePlayer from "./pages/play/SingPlayer.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/play" element={<PlayingMenu />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/play/singleplayer" element={<SinglePlayer />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
