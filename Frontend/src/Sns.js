import {Header} from "./header";
import React, { useState, useEffect} from "react";
import {init, selectedAccount} from "./Web3Client";
import Post from "./Post";
import img from "./images/user.png";
import "./App.css";
import { Profile } from "./Profile";
import axios from "axios";

const token = window.localStorage.getItem("NFTLogin");
const baseURL = "http://localhost:4000";

export const Sns = () => {   

    const baseURL = "http://localhost:4000";

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
            <Header username={'byun0501'} newPosts={createPost} openProfile={setprofileClickced} pic={pic}/>
            {profileClicked?
            <Profile user_info={user_info} setPic={setPic} pic={pic}/>
            :<div className="timeline">
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
            }
        </div>
    );
};