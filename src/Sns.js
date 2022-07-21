import {Header} from "./header";
import React, { useState, useEffect} from "react";
import {init, selectedAccount} from "./Web3Client";
import Post from "./Post";
import img from "./images/user.png";
import "./App.css";
import { Profile } from "./Profile";

export const Sns = () => {   

    const [posts, setPosts] = useState([
        {
            username: `undefined`,
            caption: "Hello NFT sda fsdafasdfasfs  adfsafdasffadddddddd ffs",
            imageUrl: img
        }
      ]);
    
    const [profileClicked, setprofileClickced] = useState(false);

      useEffect( () => {

      }, [posts])

    return(
        <div className="app">
            <Header username={'byun0501'} newPosts={setPosts} openProfile={setprofileClickced}/>
            {profileClicked?
            <Profile/>
            :<div className="timeline">
            {posts.map((post)=>(
                <Post
                //key = {} 
                username={post.username} 
                caption={post.caption} 
                imageUrl={post.imageUrl}
                />
            ))}
            </div>
            }
        </div>
    );
};