import axios from "axios";

const userApi = axios.create({
  baseURL: "/api/users",
});

export const getUser = async (signal) => {
  const response = await userApi.get("", {
    signal,
  });
  return response.data;
};

export const updateUser = async (caption, profileName, profile_pic) => {
  const response = await userApi.patch("", {
    description: caption,
    username: profileName,
    profile_pic: profile_pic,
  });
  return response;
};

export const updateProfilePic = async ([caption, profileName, profile_pic]) => {
  const response = await userApi.patch("", {
    description: caption,
    username: profileName,
    profile_pic: profile_pic,
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
  const response = await userApi.get(`/${userId}`);
  const data = await response.data;
  return data;
};

export const certainUserPost = async (userId) => {
  const response = await userApi.get(`${userId}/posts`);
  const data = await response.data;
  return data;
};
