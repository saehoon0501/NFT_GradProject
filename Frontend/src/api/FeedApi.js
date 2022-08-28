import axios from 'axios'

const feedApi = axios.create({
    baseURL:'http://localhost:4000/api/post',    
})

feedApi.interceptors.request.use((config)=>{
    const token = window.localStorage.getItem("accessToken");
    if(!token){        
        return config
    }
    config.headers = { 
        'Authorization': `Bearer ${token}`,        
      }
    return config
})

export const getPost = async (signal) => {
    const response = await feedApi.get('',{
        signal
    })
    return response.data
}

export const addPost = async (post_title, post_text) => {
    const response = await feedApi.post('',{
        post_title,
        post_text,    
    })
    return response
} 

export const likePost = async (post_id, likes) => {
    const response = await feedApi.post(`/like/${post_id}`,{
        likes
    })
    return response
}

export const dislikePost = async (post_id, likes) =>{
    const response = await feedApi.patch(`/unlike/${post_id}`,{
        likes
    })
    return response
}

export const delPost = async (post_id)=>{
    const response = await feedApi.delete(`/${post_id}`)
    return response
}

export const addComment = async ({comments_id, value}) => {
    console.log(comments_id, value)
    const response = await feedApi.post(`/comment/${comments_id}`,{
        context: value,
    })
    return response
}

export const getComment = async (comments_id) => {
    const response = await feedApi.get(`/comment/${comments_id}`)
    return response.data
}

export const likeComment = async (comments_id, index) => {
    const response = await feedApi.post(`/comment/like/${comments_id}`,{
        commentIndex: index
    })
    return response
}

export const delComment = async (comments_id, commentIndex) => {
    const response = await feedApi.delete(`/comment/${comments_id}`,{
        data:{
            commentIndex
        }
    })
    return response
}

export const likeReply = async (comments_id, commentIndex, replyIndex)=>{
    const response = await feedApi.post(`/comment/reply/${comments_id}`,{        
        commentIndex,
        replyIndex
    })    
    return response
}

export const addReply = async (comments_id, context, commentIndex) => {
    const response = await feedApi.post(`/comment/reply/${comments_id}`,{
        context,
        commentIndex,        
    })

    return response
}

export const modifyReply = async (comments_id, context, commentIndex) => {
    const response = await feedApi.patch(`/comment/${comments_id}`,{
        context,
        commentIndex
    })
    return response
}

export const delReply = async (comments_id, commentIndex, replyIndex) => {
    const response = await feedApi.delete(`/comment/reply/${comments_id}`,{
        data:{
            commentIndex,
            replyIndex
        }
    })
    return response
}