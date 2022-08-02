import { useState, useEffect } from 'react';
import Web3 from "web3/dist/web3.min.js";
import {init, mintToken, Login} from "./Web3Client";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import {Sns} from "./Sns";

let selectedAccount;

function App() {

  const [minted, setMinted] = useState(false);

  const mint = () => {
    mintToken().then(tx => {
      console.log(tx);
      setMinted(true);
    }).catch(err=>{
      console.log(err);
    })
  }

    useEffect(() => {

        init();
        
    }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>
          <div className="app">
          {!minted
            ? <button className='primary__button' onClick={()=>mint()}>Mint Token</button>
            : <p>Token Minted</p>
          }
          <Login> </Login>
          </div>
        </div>} />
        <Route exact path="/sns" element={<Sns/>} />
      </Routes>
    </Router>
  );
}

export default App;
