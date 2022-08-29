import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import { Header } from "./components/Header";
import { init } from "./components/Web3Client";

import FeedView from "./pages/FeedView";
import Login from "./pages/Login";
import { Thread } from "./pages/Thread";
import { Profile } from "./pages/Profile";

const App = () => {
  useEffect(() => {
    init();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/category" element={<Thread />} />
        <Route exact path="/category/:post_id" element={<FeedView />} />
      </Routes>
    </Router>
  );
};

export default App;
