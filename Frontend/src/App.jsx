import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import { init } from "./components/login/Web3Client";
import {
  FeedView,
  Login,
  Profile,
  Main,
  MyComments,
  User,
  NFTAd,
} from "./pages";
import { Layout } from "./components/common/Layout";
import { Search } from "./pages/Search";
import { io } from "socket.io-client";
import { Vote } from "./pages/Vote";
import { CreateVote } from "./pages/CreateVote";

function App() {
  const [socketValue, setSocketValue] = useState(null);

  useEffect(() => {
    init();
    const socket = io();
    setSocketValue(socket);
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route element={<Layout socketValue={socketValue} />}>
          <Route exact path="/" element={<Main socketValue={socketValue} />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/profile/:user_id" element={<User />} />
          <Route exact path="/posts/search/:keyword" element={<Search />} />
          <Route exact path="/:postId" element={<FeedView />} />
          <Route exact path="/comments" element={<MyComments />} />
          <Route exact path="/vote/create" element={<CreateVote />} />
          <Route exact path="/vote/:id" element={<Vote />} />
          <Route exact path="/nft" element={<NFTAd />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
