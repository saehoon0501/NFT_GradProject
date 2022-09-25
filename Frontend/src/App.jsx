import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import { Header } from "./components/common/Header";
import { init } from "./components/login/Web3Client";
import { FeedView, Login, Profile, Main, MyComments, User } from "./pages";
import { Search } from "./pages/Search";
import { io } from "socket.io-client";

const App = () => {
  const [socketValue, setSocketValue] = useState(null);

  useEffect(() => {
    init();
    const socket = io("http://localhost:4000");
    setSocketValue(socket);
  }, []);

  return (
    <Router>
      <Header socketValue={socketValue} />
      <Routes>
        <Route exact path="/" element={<Main socketValue={socketValue} />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/profile/:user_id" element={<User />} />
        <Route exact path="/search/:keyword" element={<Search />} />
        <Route exact path="/post/:post_id" element={<FeedView />} />
        <Route exact path="/comments" element={<MyComments />} />
      </Routes>
    </Router>
  );
};

export default App;
