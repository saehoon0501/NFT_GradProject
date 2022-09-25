import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:4000/api/user",
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

export const updateUser = async (caption, profileName) => {
  const response = await userApi.patch("", {
    caption,
    profileName,
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

export const updateProfilePic = async (profile_pic) => {
  const response = await userApi.patch("", {
    profile_pic,
  });
  return response;
};

export const certainUser = async (userId) => {
  const response = await axios.get(
    `http://localhost:4000/api/user?userId=${userId}`
  );
  const data = await response.data;
  return data;
};
