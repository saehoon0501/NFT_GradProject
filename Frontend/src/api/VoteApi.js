import axios from "axios";

const voteApi = axios.create({
  baseURL: "http://localhost:4000/api/poll",
});

voteApi.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("accessToken");
  if (!token) {
    return config;
  }
  config.headers = {
    Authorization: `Bearer ${token}`,
  };
  return config;
});

export const getVote = async () => {
  const response = await voteApi.get("");
  return response.data;
};

export const createTypedVote = async (title, options) => {
  const response = await voteApi.post("", {
    title,
    options,
  });
  return response;
};

export const voteOption = async (vote_id, voted_item, user_id, usedNFT) => {
  const response = await voteApi.patch(`/${vote_id}`, {
    voted_item,
    user_id,
    usedNFT,
  });
  return response;
};

export const deleteVote = async (vote_id) => {
  const response = await voteApi.delete(`/${vote_id}`);
  return response;
};
