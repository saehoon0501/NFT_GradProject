import {Header} from "./header";
import React, { useState } from "react";
import Post from "./Post";
import "./App.css";

export const Sns = () => {

    const [posts, setPosts] = useState([
        {
          username: "blessingthebobo",
          caption: "Wow, I'm Amazing!",
          imageUrl:
            "/Users/saehoonbyun/Documents/GitHub/NFT_GradProject/src/images/user.png",
        },
        {
          username: "godtello",
          caption: "Oh, I'm a God!",
          imageUrl:
            "https://images.unsplash.com/photo-1637019838019-5f14d84ee308?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
      ]);

    return(
        <div className="app">
            <Header username={'user'}/>
            <div className="timeline">
            {posts.map((post)=>(
                <Post 
                username={post.username} 
                caption={post.caption} 
                imageUrl={post.imageUrl}
                />
            ))}
            </div>
        </div>
    );
};