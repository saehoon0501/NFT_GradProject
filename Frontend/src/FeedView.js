import React, { useState, useEffect, useRef } from "react";
import like_before from "./images/like-before.png";
import like_after from "./images/like-after.png";
import comment from "./images/comment.png";
import {Button} from '@mui/material';
import parse from 'html-react-parser';
import './FeedView.css';
import 'react-quill/dist/quill.core.css';
import {useLocation} from 'react-router-dom'
import axios from 'axios';

const baseURL = "http://localhost:4000";
const token = window.localStorage.getItem("NFTLogin");

const Reply = ({user_id, comment_id, comment_index, index, writer, caption, liked_user, setReplyList}) =>{
  const [like, setLike] = useState({
    liked:false,
    liked_user:liked_user,
  });
  const [value,setValue] = useState('');
  const [toReply, setToReply] = useState(false);

  const handleLike = () =>{
    if(!like.liked){
      axios.put(`${baseURL}/api/post/comment/reply/like/${comment_id}`,{
        commentIndex: comment_index,
        replyIndex:index
      },{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }).then(res=>{
        console.log(res.data.length);
        if(res.data.includes(user_id)){
          setLike({liked:true, liked_user:res.data});
        }
      })
    }
  }

  useEffect(()=>{
    
    if(liked_user.includes(user_id)){
      setLike(prev=>({...prev, liked:true}));
    }
  },[])

  const handleReply = (event) =>{
    event.preventDefault();    
    console.log(value);
    axios.post(`${baseURL}/api/post/comment/reply/${comment_id}`,{
      context: value,
      commentIndex: index
    },{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
    .then((res)=>{
      console.log(res.data);
      setReplyList(res.data);
    })
    setValue('');
}

  return(
    <div style={{display:'block'}}>
    <div className="commenter" style={{padding:'0 0 0 50px'}}>
    <img src={writer.profile.profile_pic} alt="comment_profilePic"/>
      <div style={{display:'block', width:'100%'}}>
        <div style={{display:'flex'}}>
          <h5>{writer.profile.username}</h5>
          <h5> · </h5>
          <h5>n 시간 전</h5>              
        </div>
        <div className="comment_context" style={{maxWidth:'500px'}}>        
          <p>{`@${writer.profile.username}`+'\u00a0\u00a0'+caption}</p>          
        </div>
        <div style={{display:'flex'}}>
          <div className="clickable comment_button" onClick={()=>{setToReply(!toReply)}} 
            style={{position:"relative", margin:"-6px 0px 0 -5px"}}>
              <img src={comment}/>
          </div>
          <div className="clickable" onClick={()=>{setToReply(!toReply)}}>
          <h5>Reply</h5>            
          </div>
          <h5>  </h5>
          {like.liked?
          <div className="clickable icon_anime2 comment_button" style={{position:"relative", marginTop:"px"}}>
            <img src={like_after} onClick={handleLike}/>
          </div>
            :<div className="clickable comment_button" style={{position:"relative", marginTop:"-6px"}}>
                <img src={like_before} onClick={handleLike}/>
            </div>      
          }            
          <h5>{like.liked_user==undefined?0:like.liked_user.length}개</h5>            
        </div>      
      </div>      
    </div>
    {toReply?
        <div className="comment" style={{maxWidth:'100%'}}>
            <p><h4>답글 달기</h4></p>
          <textarea value={value} onChange={(e)=>{setValue(e.target.value)}} placeholder="매너있는 댓글 작성 부탁드립니다."></textarea>
          <div style={{textAlign:'right'}}>
          <Button
            onClick={handleReply}            
            sx={{backgroundColor:'#26a7de', margin:'5px 0px 0px 0px', padding:'0 15px',color:'white'}}>
            완료
          </Button>
          </div>
        </div>
        :<div></div>
      }     
    </div>
  );
} 

const Comment = ({user_id, comment_id, index, writer, reply, caption, liked_user}) =>{
  const [like, setLike] = useState({
    liked:false,
    liked_user:liked_user,
  });
  const [toReply, setToReply] = useState(false);
  const [replyList, setReplyList]= useState(reply);
  const [value, setValue] = useState();

  useEffect(()=>{
    
    if(liked_user.includes(user_id)){
      setLike(prev=>({...prev, liked:true}));
    }

  },[])

  const handleLike = () =>{
    if(!like.liked){
      axios.post(`${baseURL}/api/post/comment/like/${comment_id}`,{
        commentIndex: index
      },{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }).then(res=>{
        console.log(res.data.length);
        if(res.data.includes(user_id)){
          setLike({liked:true, liked_user:res.data});
        }
      })
    }
  }

  const handleReply = (event) =>{
    event.preventDefault();
    axios.post(`${baseURL}/api/post/comment/reply/${comment_id}`,{
      context: value,
      commentIndex: index
    },{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
    .then((res)=>{
      console.log(res.data);
      setReplyList(res.data);
    })
    setValue('');
}

  return(
    <div style={{display:'block'}}>
    <div className="commenter">
    <img src={writer.profile.profile_pic} alt="comment_profilePic"/>
      <div style={{display:'block'}}>
      <div style={{display:'flex'}}>
        <h5>{writer.profile.username}</h5>
        <h5> · </h5>
        <h5>n 시간 전</h5>              
      </div>
      <div className="comment_context">
        <p>{caption}</p>
      </div>
      <div style={{display:'flex'}}>
      <div className="clickable comment_button" onClick={()=>{setToReply(!toReply)}}
          style={{display:'flex',position:"relative", margin:"-6px 0px 0 -5px"}}>
          <img src={comment}/>          
      </div>
      <div className="clickable" onClick={()=>{setToReply(!toReply)}}>
        <h5>Reply</h5>
      </div>
      <h5>  </h5>
      {like.liked?
      <div className="clickable icon_anime2 comment_button" style={{position:"relative", marginTop:"-6px"}}>
        <img src={like_after} onClick={handleLike}/>
      </div>
        :<div className="clickable comment_button" style={{position:"relative", marginTop:"-6px"}}>
            <img src={like_before} onClick={handleLike}/>
        </div>      
      }            
      <h5>{like.liked_user==undefined?0:like.liked_user.length}개</h5>            
      </div>      
      </div>      
    </div>
    {toReply?
        <div className="comment">
            <p><h4>답글 달기</h4></p>
          <textarea value={value} onChange={(e)=>{setValue(e.target.value)}} placeholder="매너있는 댓글 작성 부탁드립니다."></textarea>
          <div style={{textAlign:'right'}}>
          <Button
            onClick={handleReply}            
            sx={{backgroundColor:'#26a7de', margin:'5px 0px 0px 0px', padding:'0 15px',color:'white'}}>
            완료
          </Button>
          </div>
        </div>
        :<div></div>
      }
      {replyList.length>0?
      <div style={{padding:'0 0 0 50px', color:'rgb(178, 178, 178)', display:'flex'}}>
        <div class="_a9yh"></div>
        <p>답글</p>
        <div class="_a9yh"></div>
      </div>
      :<div></div>
      }
      {
        replyList.map((replyItem,reply_index)=>{          
          return <Reply                        
            comment_id={comment_id}
            comment_index={index}
            index={reply_index}
            user_id={user_id}
            writer={replyItem.user}
            caption={replyItem.caption}
            liked_user={replyItem.liked_user}
            setReplyList={setReplyList}            
          />
        })
      }
    </div>
  );
} 

function FeedView() {

  const {state} = useLocation();
  const {id, username, user_id, caption, title, userPic, comments } = state;
  let {likes} = state;  

  const [value, setValue] = useState();
  const [commentList, setCommentList]= useState([]);
  const [like, setLike] = useState({
    liked: false,
    liked_num: likes.liked_user.length
  });

  useEffect(()=>{
    if(likes.liked_user.includes(user_id)){
      setLike(prev=>({...prev, liked:true}));
    }

    axios.get(`${baseURL}/api/post/comment/${comments._id}`,
    {
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
    .then((res)=>{
      console.log(res.data.comments);      
      setCommentList(res.data.comments);
    })

    return ()=>{

    }      
  },[])

  const handleLike = async () =>{
    if(!like.liked){      
      axios.put(`${baseURL}/api/post/like/${id}`,{        
        likes
      },{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }).then(res=>{
        likes = res.data;
        if(likes.liked_user.includes(user_id)){
          setLike({liked:true, liked_num: likes.liked_user.length});
        }
      })
      .catch(err=>console.log(err))
    }else{
      await axios.put(`${baseURL}/api/post/unlike/${id}`,{        
        likes
      },{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }).then(res=>{
        likes = res.data;
        setLike({liked:false, liked_num: likes.liked_user.length});
      })      
    }
  }

  const handleComment = (event) =>{
      event.preventDefault();
      axios.post(`${baseURL}/api/post/comment/${comments._id}`,{
        context: value,
      },{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      })
      .then((res)=>{
        console.log(res.data);
        setCommentList(res.data.comments);
      })
      setValue('');
  }

  return (
    <div>
    <div className="feedview" style={{display:"block", border:"1px solid lightgray", borderRadius:"5px"}}>
        <div className="" style={{width:"500px"}}>
            <div className="feedview_header" style={{display:"block"}}>
                <div style={{display:'flex'}}>
                    <div className="feed_avatar">
                        <img 
                            src={userPic}
                            alt="profile picture"
                            style={{width:"40px", height:"40px", borderRadius:"10px"}}
                            />            
                    </div>
                    <div style={{position:"relative", marginLeft:"5px",display:"flex", marginTop:"10px" }}>
                        <div>
                            <h3>{username}</h3>
                        </div>
                        <div className="post__text">
                            <span>n일 전</span>
                        </div>
                    </div>
                </div>        
            </div>
        <div style={{maxWidth:'700px', width:'700px'}}>
            {/* Title */}
            <div style={{textAlign:"left", padding:"10px 10px 10px 80px", position:"relative", marginTop:"-40px"}}>
                    <h2 style={{lineHeight:"22px"}}>{title}</h2>
            </div>
            {/* Content */}
            <div className="ql-editor" style={{textAlign:"left", padding:"10px 10px 10px 10px", width:'100%'}}>
                {parse(caption)}        
            </div>
        </div>
      </div>
      {/* INFO */}
      <div style={{display:"flex", padding:"10px 10px 5px 15px"}}>
        <div>
            <h4>댓글 {comments.comments.length}개</h4>
        </div>
        <div className="clickable" style={{position:"relative", margin:"-3px 5px 0 5px"}}>
                <img src={comment} />
        </div>
        <div>
            <h4>좋아요 {like.liked_num}개</h4>
        </div>        
            {like.liked?
            <div className="clickable_icon icon_anime2" style={{position:"relative", marginTop:"-3px", marginLeft:"10px"}}>
              <img src={like_after} onClick={handleLike}/>
            </div>
              :<div className="clickable" style={{position:"relative", marginTop:"-3px", marginLeft:"10px"}}>
                  <img src={like_before} onClick={handleLike}/>
              </div>      
            }
        </div>
        <div className="comment">
            <p><h4>댓글 쓰기</h4></p>
          <textarea value={value} onChange={(e)=>{setValue(e.target.value)}} placeholder="매너있는 댓글 작성 부탁드립니다."></textarea>
          <div style={{textAlign:'right'}}>
          <Button
            onClick={handleComment}            
            sx={{backgroundColor:'#26a7de', margin:'5px 0px 0px 0px', padding:'0 15px',color:'white'}}>
            완료
          </Button>
          </div>
        </div>             
    </div>      
      <div className="commenter">
            댓글들
      </div>
      <div className="comment_list">      
       {commentList.map((comment,index)=>{                
          return <Comment
            key={index}
            index={index}
            comment_id={comments._id}
            user_id={user_id}
            writer={comment.user}
            caption={comment.caption}
            liked_user={comment.liked_user}
            reply={comment.reply}            
          />
       })
       }  
        </div>            
      </div>    
  );
}

export default FeedView;