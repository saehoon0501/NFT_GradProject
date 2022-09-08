import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import { Header } from "./components/common/Header";
import { init } from "./components/login/Web3Client";
import { FeedView, Login, Profile, Main, MyComments } from "./pages";
import { Search } from "./pages/Search";

const App = () => {
  useEffect(() => {
    init();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/search/:keyword" element={<Search />} />
        <Route exact path="/post/:post_id" element={<FeedView />} />
        <Route exact path="/comments" element={<MyComments />} />
      </Routes>
    </Router>
  );
};

export default App;
