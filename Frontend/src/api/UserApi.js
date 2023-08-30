import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:4000/api/users",
});

userApi.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("accessToken");
  if (!token) {
    return config;
  }
  config.headers = {
    Authorization: `Bearer ${token}`,
  };
  return config;
});

export const getUser = async (signal) => {
  const response = await userApi.get("", {
    signal,
  });
  return response.data;
};

export const updateUser = async (caption, profileName, profile_pic) => {
  const response = await userApi.patch("", {
    caption: caption,
    profileName: profileName,
    profile_pic: profile_pic,
  });
  return response;
};

export const updateProfilePic = async ([caption, profileName, profile_pic]) => {
  const response = await userApi.patch("", {
    caption,
    profileName,
    profile_pic,
  });
  return response;
};

export const getUserPosts = async () => {
  const response = await userApi.get("/posts");
  return response.data;
};

export const getUserComments = async (caption, profileName) => {
  const response = await userApi.get("/comments");
  const data = await response.data;
  return data;
};

export const certainUser = async (userId) => {
  const response = await userApi.get(`?userId=${userId}`);
  const data = await response.data;
  return data;
};

export const certainUserPost = async (postId) => {
  const response = await userApi.get(`/posts?publicAddress=${postId}`);
  const data = await response.data;
  return data;
};
