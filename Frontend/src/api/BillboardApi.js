import axios from "axios";

const billBoardApi = axios.create({
  baseURL: "http://localhost:4000/api/billboard",
});

billBoardApi.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("accessToken");
  if (!token) {
    return config;
  }
  config.headers = {
    Authorization: `Bearer ${token}`,
  };
  return config;
});

export const personalizeSquare = async (squareNumber, rgbData, url, description) => {
    const response = await billBoardApi.post('/',{
      squareNumber,
      rgbData,
      url,
      description
    });
    const data = await response.data;
    return data;
  }
