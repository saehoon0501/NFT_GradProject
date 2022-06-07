import { useState, useEffect } from 'react';
import Web3 from "web3/dist/web3.min.js";
import {init, mintToken, Login, Login2} from "./Web3Client";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import {Sns} from "./Sns";


function App() {

  const [red, green, blue] = [253, 162, 154];

  const [offset, setOffset] = useState(0);

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

        const onScroll = () => setOffset(window.pageYOffset);
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    console.log(offset);

    const x = 1 + offset / 100;
    const y = 1 + offset / 160;
    const z = 1 + offset / 300;
    
    const [r, g, b] = [red/x, green/y, blue/z].map(Math.round);

    const rgb = {
      backgroundColor: `rgb(${r},${g},${b})`
    };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="App" style={rgb}>
          {!minted
            ? <button onClick={()=>mint()}>Mint Token</button>
            : <p>Token Minted</p>
          }
          <Login> </Login>
          <Login2>  </Login2>
        </div>} />
        <Route exact path="/sns" element={<Sns></Sns>} />
      </Routes>
    </Router>
  );
}

export default App;
