import { useState, useEffect } from 'react';
import {init, mintToken, Login} from "./Web3Client";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import {Thread} from "./Thread";
import {Header} from "./Header";
import FeedView from './FeedView';
import axios from 'axios';
import { Profile } from "./Profile";




const baseURL = "http://localhost:4000";
const token = window.localStorage.getItem("NFTLogin");


function App() {

  const [minted, setMinted] = useState(false);
  const [isAuth, setIsAuth] = useState();  
  
  const mint = () => {
    mintToken().then(tx => {
      console.log(tx);
      setMinted(true);
    }).catch(err=>{
      console.log(err);
    })
  }

  const createPost = async ({username, caption, image}) =>{

    const data = new FormData();
    
    data.append('file', image);
    data.append('caption', caption);
    data.append('user', username);
     
    await axios.post(`${baseURL}/api/post`,data
        ,{
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
        }
    }).then((res)=>{
        console.log(res.data);
    });
  }

    useEffect(() => {
        init();
        setIsAuth(false)
      return () => {        
      }
    }, []);



  return (
    <Router>
      {
        isAuth?
        undefined        
        :<Header newPosts={createPost}/>
      }      
      <Routes> 
        <Route exact path='/login' element={<div>
          <div className="app">
          {!minted
            ? <button className='primary__button' onClick={()=>mint()}>Mint Token</button>
            : <p>Token Minted</p>
          }
          <Login setIsAuth={setIsAuth}/>
          </div>
        </div>  }/>       
        <Route exact path="/:category" element={<Thread setIsAuth={setIsAuth}/>} />
        <Route exact path="/profile" element={<Profile/>} />
        <Route exact path="/:category/:post_id" element={<FeedView/>} />
      </Routes>
    </Router>
  );
}

export default App;
