import React, { useState, useEffect, useRef} from "react";
import like_before from "./images/like-before.png";
import like_after from "./images/like-after.png";
import comment from "./images/comment.png";
import {Button} from '@mui/material';
import parse from 'html-react-parser';
import './FeedView.css';
import 'react-quill/dist/quill.core.css';
import {likePost, dislikePost, delPost, addComment, getComment, likeComment, delComment
  , addReply, modifyReply, likeReply, delReply} from './api/FeedApi'
import {useLocation} from 'react-router-dom'
import {useQuery, useMutation, useQueryClient} from 'react-query'

const Reply = ({user_id, comment_id, comments_id, comment_index, reply_index, writer, caption, liked_user, setReplyList}) =>{
  const [like, setLike] = useState({
    liked:false,
    liked_user:liked_user,
  });
  const [value,setValue] = useState('');
  const [toReply, setToReply] = useState({
    reply:false,
    modify:false,
  });
  const [isOwner, setIsOwner] = useState(false);

  const textareaRef = useRef(null);

  useEffect(()=>{

    if(textareaRef.current){     
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.max(
      textareaRef.current.scrollHeight,
      47
    )}px`;
    }
    
    if(writer._id==user_id && isOwner===false && writer.profile.comments_ids.includes(comment_id)){
      setIsOwner(true);
    }
    
    
    if(liked_user.includes(user_id)){
      setLike(prev=>({...prev, liked:true}));
    }
  },[value,toReply])

  const handleLike = () =>{
    if(!like.liked){
      likeReply(comments_id, comment_index, reply_index)      
      .then(res=>{
        console.log(res.data.length);
        if(res.data.includes(user_id)){
          setLike({liked:true, liked_user:res.data});
        }
      })
    }
  }

  const handleReply = (event) =>{
    event.preventDefault();    
    console.log(value);
    addReply(comments_id, value, comment_index)    
    .then((res)=>{
      console.log(res.data);
      setReplyList(res.data);
    })
    setValue('');
}

const handleDelete = ()=>{
  delReply(comments_id, comment_index, reply_index)
  .then((res)=>{
    console.log(res.data);
    setReplyList(res.data);
  })
}

  return(
    <div style={{display:'block'}}>
    <div className="commenter" style={{padding:'0 0 0 50px'}}>
    <img src={writer.profile.profile_pic} alt="comment_profilePic"/>
      <div style={{display:'block', width:'90%'}}>
        <div style={{display:'flex'}}>
          <h5>{writer.profile.username}</h5>
          <h5> · </h5>
          <h5>n 시간 전</h5>              
        </div>
        <div className="comment_context" style={{maxWidth:'100%'}}>        
          <p>{`@${writer.profile.username}`+'\u00a0\u00a0'+caption}</p>          
        </div>
        <div style={{display:'flex'}}>
          <div className="clickable comment_button" onClick={()=>{setToReply({reply:!toReply.reply, modify:false}); setValue('')}} 
            style={{position:"relative", margin:"-6px 0px 0 -5px"}}>
              <img src={comment}/>
          </div>
          <div className="clickable" onClick={()=>{setToReply({reply:!toReply.reply, modify:false}); setValue('')}}>
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
          {
            isOwner? 
            <div style={{display:'flex'}}>
            <div className="clickable" onClick={()=>{setToReply({reply:!toReply.reply, modify:true}); setValue(caption)}}>
              <h5>{'\u00a0'}수정{'\u00a0'}</h5>              
            </div>
            <div className="clickable" onClick={handleDelete}>
              <h5>삭제</h5>
            </div>
            </div>
            :<div></div>
          }            
        </div>      
      </div>      
    </div>
    {toReply.reply?
        <div className="comment" style={{maxWidth:'100%'}}>
            {toReply.modify?<h4>답글 수정</h4>:<h4>답글 달기</h4>}
          <textarea ref={textareaRef} value={value} onChange={(e)=>{setValue(e.target.value)}} placeholder="매너있는 댓글 작성 부탁드립니다.">             
          </textarea>
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

const Comment = ({user_id, comment_id, index, writer, reply, caption, liked_user, comments_id}) =>{
  const [like, setLike] = useState({
    liked:false,
    liked_user:liked_user,
  });
  const [toReply, setToReply] = useState({
    reply:false,
    modify:false,
  });
  const [replyList, setReplyList]= useState(reply);
  const [value, setValue] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [context, setContext] = useState(caption);

  const textareaRef = useRef(null);


  useEffect(()=>{

     if(textareaRef.current){     
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.max(
      textareaRef.current.scrollHeight,
      47
    )}px`;
    }

    
    if(writer._id==user_id && isOwner===false && writer.profile.comments_ids.includes(comment_id)){
      setIsOwner(true);
    }
    
    if(liked_user.includes(user_id)&&like.liked===false){
      setLike(prev=>({...prev, liked:true}));
    }

  },[value])

  const handleLike = () =>{
    if(!like.liked){
      likeComment(comments_id,index)
      .then(res=>{
        console.log(res.data.length);
        if(res.data.includes(user_id)){
          setLike({liked:true, liked_user:res.data});
        }
      })
    }
  }

  const handleReply = (event) =>{
    addReply(comments_id, value, index)    
    .then((res)=>{
      console.log(res.data);
      setReplyList(res.data);
    })
    setValue('');
}

const handleModify = (event) =>{
  modifyReply(comments_id, value, index)
  .then((res)=>{
    console.log(res.data);
    setContext(res.data.caption);
  })
  setValue('');
}

const handleDelete = ()=>{
  delComment(comments_id, index)
  .then((res)=>{
    console.log(res.data);    
  })
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
        <p>{context}</p>
      </div>
      <div style={{display:'flex'}}>
      <div className="clickable comment_button" onClick={()=>{setToReply({reply:!toReply.reply, modify:false}); setValue('')}}
          style={{display:'flex',position:"relative", margin:"-6px 0px 0 -5px"}}>
          <img src={comment}/>          
      </div>
      <div className="clickable" onClick={()=>{setToReply({reply:!toReply.reply, modify:false}); setValue('')}}>
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
      {isOwner? 
            <div style={{display:'flex'}}>
            <div className="clickable" onClick={()=>{setToReply({reply:!toReply.reply, modify:true}); setValue(caption)}}>
              <h5>{'\u00a0'}수정{'\u00a0'}</h5>              
            </div>
            <div className="clickable" onClick={handleDelete}>
              <h5>삭제</h5>
            </div>
            </div>
            :<div></div>
          }                      
      </div>      
      </div>      
    </div>
    {toReply.reply?
        <div className="comment">
          {toReply.modify?<h4>답글 수정</h4>:<h4>답글 달기</h4>}
          <textarea ref={textareaRef} value={value} onChange={(e)=>{setValue(e.target.value)}} placeholder="매너있는 댓글 작성 부탁드립니다."></textarea>
          <div style={{textAlign:'right'}}>
          <Button
            onClick={toReply.modify?handleModify:handleReply}            
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
            comments_id={comments_id}
            comment_id={comment_id}            
            comment_index={index}
            reply_index={reply_index}
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
  const {id, writer_profile, user_id, caption, title, comments_id } = state;
  let {likes} = state;  

  const [value, setValue] = useState('')
  const [like, setLike] = useState({
    liked: false,
    liked_user: likes.liked_user
  });

  const queryClient = useQueryClient();

  const {isLoading, data} = useQuery(['comments',comments_id],()=>getComment(comments_id),{
    onSuccess: () =>{      
      console.log(data)      
    }    
  })

  const commentMutate = useMutation(['comments',comments_id],addComment,{
    onSuccess:()=>{
      queryClient.invalidateQueries(['comments',comments_id])
    }
  })

  const textareaRef = useRef(null);

  useEffect(()=>{
      
      if(like.liked_user.includes(user_id)&&like.liked===false){
        setLike(prev=>({...prev, liked:true}));
      }
  
    if(textareaRef.current){     
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.max(
      textareaRef.current.scrollHeight,
      47
    )}px`;
    }
    
    return ()=>{

    }      
  },[value])

  const handleLike = async () =>{
    if(!like.liked){      
      likePost(id,likes).then(res=>{
        likes = res.data;
        if(likes.liked_user.includes(user_id)){
          setLike({liked:true, liked_user: likes.liked_user});
        }
      })
      .catch(err=>console.log(err))
    }else{
      dislikePost(id,likes).then(res=>{
        likes = res.data;
        setLike({liked:false, liked_user: likes.liked_user});
      })      
    }
  }

  const handleComment = (event) =>{            
    console.log(value)
    const para = {
      comments_id,
      value
    }
      commentMutate.mutate(para)
      setValue('');
  }

  if(isLoading){
    return <div><p>is Loading...</p></div>
  }
  
  return (
    <div>
    <div className="feedview" style={{display:"block", border:"1px solid lightgray", borderRadius:"5px"}}>
        <div className="" style={{width:"500px"}}>
            <div className="feedview_header" style={{display:"block"}}>
                <div style={{display:'flex'}}>
                    <div className="feed_avatar">
                        <img 
                            src={writer_profile.profile_pic}
                            alt="profile picture"
                            style={{width:"40px", height:"40px", borderRadius:"10px"}}
                            />            
                    </div>
                    <div style={{position:"relative", marginLeft:"5px",display:"flex", marginTop:"10px" }}>
                        <div>
                            <h3>{writer_profile.username}</h3>
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
            <h4>댓글 {data.comments.length}개</h4>
        </div>
        <div className="clickable" style={{position:"relative", margin:"-3px 5px 0 5px"}}>
                <img src={comment} />
        </div>
        <div>
            <h4>좋아요 {like.liked_user.length}개</h4>
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
          <textarea ref={textareaRef} value={value} onChange={(e)=>{setValue(e.target.value)}} placeholder="매너있는 댓글 작성 부탁드립니다."></textarea>
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
       {data.comments.map((comment,index)=>{           
        console.log(comment)       
          return <Comment
            key={comment._id}
            index={index}
            comment_id={comment._id}
            comments_id={comments_id}
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