import axios from "axios";

const billBoardApi = axios.create({
  baseURL: "http://localhost:4000/api/billboard",
});

export const personalizeSquare = async (
  squareNumber,
  rgbData,
  url,
  description
) => {
  const response = await billBoardApi.post("/", {
    squareNumber,
    rgbData,
    url,
    description,
  });
  const data = await response.data;
  return data;
};
