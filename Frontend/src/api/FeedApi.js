import axios from "axios";

const feedApi = axios.create({
  baseURL: "api/posts",
});

export const getPost = async (pageNum) => {
  const response = await feedApi.get(`?filter=recent&pageNum=${pageNum}`);
  console.log(response.data);
  return response.data;
};

export const getBestPost = async (pageNum) => {
  const response = await feedApi.get(`?filter=best&pageNum=${pageNum}`);
  return response.data;
};

export const addPost = async (post_title, post_text) => {
  const response = await feedApi.post("", {
    post_title,
    post_text,
  });
  return response;
};

export const likePost = async (post_id) => {
  const response = await feedApi.post(`${post_id}/likes`);
  return response;
};

export const dislikePost = async (post_id) => {
  const response = await feedApi.patch(`${post_id}/likes`);
  console.log(response);
  return response;
};

export const delPost = async (post_id) => {
  const response = await feedApi.delete(`/${post_id}`);
  return response;
};

export const addComment = async (postId, value) => {
  const response = await feedApi.post(`/${postId}/comments`, {
    context: value,
  });
  return response;
};

export const getComments = async (post_id) => {
  const response = await feedApi.get(`/${post_id}/comments`);
  return response.data;
};

export const likeComment = async (comment_id) => {
  const response = await feedApi.post(`/comments/${comment_id}/likes`, {});
  return response;
};

export const unLikeComment = async (comment_id) => {
  const response = await feedApi.patch(`/comments/${comment_id}/likes`, {});
  return response;
};

export const addReply = async (comment_id, context) => {
  console.log("addReply", comment_id, context);
  const response = await feedApi.post(`/comments/${comment_id}`, {
    context,
  });

  return response;
};

export const searchPost = async (keyword) => {
  const response = await feedApi.get(`/search?keyword=${keyword}`);
  const data = await response.data;
  return data;
};
