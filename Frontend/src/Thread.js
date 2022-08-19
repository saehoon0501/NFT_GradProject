import React, { useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import Feed from "./Feed";
import "./Thread.css";
import { CategoryBar } from "./CategoryBar";
import { Submit } from "./Submit";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

import new_icon from "./images/new.png";
import new_icon2 from './images/new2.png';
import best from "./images/best.png";
import best2 from './images/best2.png';

const token = window.localStorage.getItem("NFTLogin");
const baseURL = "http://localhost:4000";


export const Thread = (props) => {
    
    const {category} = useParams();
    const [posts, setPosts] = useState([]);
    const[user_info, setUser_info]= useState({});
    const [profileClicked, setprofileClickced] = useState(false);
    const [pic, setPic] = useState('');
    const [filter_best, setBest]= useState(false);
    const [filter_new, setNew] = useState(true);

    const navigate = useNavigate();

    const handleFilter = ()=>{
        setNew(!filter_new);
        setBest(filter_new);
    };

      useEffect( () => {
            const cancelToken = axios.CancelToken.source();            
            const token = window.localStorage.getItem("NFTLogin");
    
            props.setIsAuth(false);

            if(!token) {
                navigate('/login'); 
                return
               }

            axios.get(`${baseURL}/api/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cancelToken: cancelToken.token
            }).then((res)=>{
                setUser_info(res.data);                
                setPic(`${res.data.profile.profile_pic}`);
            }).catch((err)=>{
                console.log(err);
                navigate('/login');
                if(axios.isCancel(err)){
                    console.log("axios cancelled")
                }
            })

            axios.get(`${baseURL}/api/post`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((res)=>{                
                let res2 = [];
                res.data.map((post)=>{
                    res2.push({
                        post_id: post.post_id,
                        username:post.post_username,                 
                        caption:post.post_text,
                        title: post.post_title,
                        userPic: post.post_userPic,
                        likes: post.post_liked,
                        comments: post.post_comments,
                        createdAt: post.createdAt,
                    })
                });               
                setPosts(res2);
            }).catch((err)=>console.log(err));
            return () => {
                cancelToken.cancel();
            }
      }, []);

    return(
        <div className="app">            
              
            <div className="timeline">
                <CategoryBar/>
                <Submit pic={pic} user_info={user_info} setPosts={setPosts}/>
                <div style={{display:"flex", border:"1px solid lightgray", padding:"10px", borderRadius:"5px", width:"500px",
                marginBottom:"10px"}}>
                    <div className={filter_best?"filter_icon clickable":"clickable"} style={{border:"1px solid lightgray",
                     borderRadius:"10px", padding:"6px", margin:"0 10px", display:"flex"}} onClick={handleFilter}>
                     <div>
                        <img src={filter_best?best2:best} alt='best_icon'/>
                    </div>
                    <div style={{position:"relative", margin:"3px 3px 0 3px"}}>
                        <h3>Best</h3>
                    </div>
                    </div>
                    <div className={filter_new?"filter_icon clickable":"clickable"} style={{border:"1px solid lightgray",
                     borderRadius:"10px", padding:"6px", margin:"0 3px", display:"flex"}} onClick={handleFilter}>
                     <div>
                        <img src={filter_new?new_icon2:new_icon} alt='new_icon'/>
                    </div>
                    <div style={{position:"relative", margin:"3px 3px 0 3px"}}>
                       <h3>New</h3> 
                    </div>
                    </div>
                </div>
            {posts.map((post)=>(
                <Feed
                key = {post.post_id}
                id = {post.post_id} 
                username={post.username} 
                user_id={user_info._id}
                caption={post.caption} 
                title={post.title}
                userPic={post.userPic}
                comments={post.comments}
                likes={post.likes}
                />
            ))}
                </div>
            </div>                    
    );
};