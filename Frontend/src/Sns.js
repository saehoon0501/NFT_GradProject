import {Header} from "./Header";
import React, { useState, useEffect} from "react";
import Post from "./Post";
import "./App.css";
import { Profile } from "./Profile";

import home from "./images/home.png";
import star from "./images/star.png";
import illustrate from "./images/illustrate.png";
import chat from "./images/chat.png";
import nft from "./images/nft.png";
import axios from "axios";

const token = window.localStorage.getItem("NFTLogin");
const baseURL = "http://localhost:4000";

export const Sns = () => {   

    const [posts, setPosts] = useState([]);

    const[user_info, setUser_info]= useState({});
    
    const [profileClicked, setprofileClickced] = useState(false);

    const [pic, setPic] = useState('');

      useEffect( () => {
            const token = window.localStorage.getItem("NFTLogin");
            axios.get(`${baseURL}/api/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((res)=>{
                setUser_info(res.data);
                setPic(`${res.data.profile.profile_pic}`);
            }).catch((err)=>console.log(err));

            axios.get(`${baseURL}/api/post`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((res)=>{
                let res2 = [];
                res.data.map((post)=>{
                    console.log(post);
                    res2.push({
                        username:post.post_username,
                        caption:'',
                        imageUrl: "data:image/png;base64,"+post.base64,
                        userPic: post.post_userProfile
                    })
                });
                setPosts(res2);
            }).catch((err)=>console.log(err));


      }, []);

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

    return(
        <div className="app">
            {/* <Header username={'byun0501'} newPosts={createPost} openProfile={setprofileClickced} pic={pic}/> */}
            {profileClicked?
            <Profile user_info={user_info} setPic={setPic} pic={pic}/>
            :<div style={{display:"flex"}}>
            <div style={{display:"block", position:"fixed", padding:"10px", border:"1px solid lightgray", width:"180px",height:"250px",
            textAlign:"left", top:"74px", left:"240px"}}>
                <div style={{margin:"0 0 10px 0"}}>
                    <span>Feeds</span>
                </div>
                <div style={{margin:"0 0 5px 5px"}}>
                    <img src={home} alt="home_icon" />
                    <span>Home</span>
                </div>
                <div style={{margin:"0 0 5px 5px"}}>
                    <img src={star} alt="home_icon" />
                    <span>Popular</span>
                </div>
                <div style={{margin:"10px 0 10px 0"}}>
                    <span>Explore</span>
                </div>
                <div style={{margin:"0 0 5px 5px"}}>
                    <img src={illustrate} alt="home_icon" />
                    <span>일러스트</span>
                </div>
                <div style={{margin:"0 0 5px 5px"}}>
                    <img src={chat} alt="home_icon" />
                    <span>자유</span>
                </div>
                <div style={{margin:"0 0 5px 5px"}}>
                    <img src={nft} alt="home_icon" />
                    <span>NFT</span>
                </div>
            </div>
            <div className="timeline">
            {posts.map((post)=>(
                <Post
                //key = {} 
                username={post.username} 
                caption={post.caption} 
                imageUrl={post.imageUrl}
                userPic={post.userPic}
                />
            ))}
                </div>
            </div>
            }
        </div>
    );
};