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

export const likePost = async (post_id, likes) => {
  const response = await feedApi.post(`/like`, {
    likes,
  });
  return response;
};

export const dislikePost = async (post_id, likes) => {
  const response = await feedApi.patch(`/unlike`, {
    likes,
  });
  return response;
};

export const delPost = async (post_id) => {
  const response = await feedApi.delete(`/${post_id}`);
  return response;
};

export const addComment = async ({ post_id, value }) => {
  const response = await feedApi.post(`/comment/${post_id}`, {
    context: value,
  });
  return response;
};

export const getComment = async (post_id) => {
  const response = await feedApi.get(`/comment/${post_id}`);
  return response.data;
};

export const likeComment = async (comment_id) => {
  const response = await feedApi.post(`/comment/like/${comment_id}`, {});
  return response;
};

export const delComment = async (comment_id, post_id) => {
  const response = await feedApi.delete(`/comment/${comment_id}`, {
    data: {
      post_id,
    },
  });
  return response;
};

export const likeReply = async (comment_id) => {
  const response = await feedApi.post(`/comment/like/${comment_id}`, {});
  return response;
};

export const addReply = async (comment_id, context) => {
  const response = await feedApi.post(`/comment/reply/${comment_id}`, {
    context,
  });

  return response;
};

export const modifyReply = async (comment_id, context, commentIndex) => {
  const response = await feedApi.patch(`/comment/${comment_id}`, {
    context,
    commentIndex,
  });
  return response;
};

export const delReply = async (comment_id, reply_id) => {
  const response = await feedApi.delete(`/comment/reply/${comment_id}`, {
    data: {
      reply_id,
    },
  });
  return response;
};

export const searchPost = async (keyword) => {
  const response = await feedApi.get(`/search?keyword=${keyword}`);
  const data = await response.data;
  return data;
};
