import {Header} from "./header";
import React, { useState, useEffect} from "react";
import {init, selectedAccount} from "./Web3Client";
import Post from "./Post";
import img from "./images/user.png";
import "./App.css";

let username;

export const Sns = () => {   

    const [posts, setPosts] = useState([
        {
            username: `undefined`,
            caption: "Hello NFT",
            imageUrl: img
        }
      ]);

      useEffect( () => {



      }, [posts])

    return(
        <div className="app">
            <Header username={'user'}/>
            <div className="timeline">
            {posts.map((post)=>(
                <Post
                //key = {} 
                username={post.username} 
                caption={post.caption} 
                imageUrl={post.imageUrl}
                />
            ))}
            </div>
        </div>
    );
};