import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import { Header } from "./components/common/Header";
import { init } from "./components/login/Web3Client";
import { FeedView, Login, Profile, Thread } from "./pages";

const App = () => {
  useEffect(() => {
    init();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Thread />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/post/:post_id" element={<FeedView />} />
      </Routes>
    </Router>
  );
};

export default App;
