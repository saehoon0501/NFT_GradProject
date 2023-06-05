import { useRef, useState, useMemo } from "react";
import { Button } from "@mui/material";
import "./Submit.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { addPost } from "../../api/FeedApi";
import { useRecoilState } from "recoil";
import {
  currentPopUpState,
  currentPostTextState,
  currentPostTitleState,
  isWritingPost,
  showPopUpState,
} from "../../store";
import { CANCEL_FEED, WRITE_FEED } from "../../utils";

const maxSize = 30 * 1000 * 1000;
const token = window.localStorage.getItem("accessToken");
const baseURL = "http://localhost:4000";

const uploadURL = (file) => {
  return new Promise((resolve, reject) => {
    const data = new FormData();

    data.append("file", file);

    const result = axios.post(`${baseURL}/api/uploads`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    if (result) resolve(result);
    else reject(new Error("failed to get Image URL"));
  });
};

export const Submit = ({ user, title, setTitle, setIsBest }) => {
  const [isOpen, setIsOpen] = useRecoilState(isWritingPost);
  const [selectedImage, setImage] = useState(null);
  const [showPopUp, setShowPopUp] = useRecoilState(showPopUpState);
  const [currentPopUp, setCurrentPopUp] = useRecoilState(currentPopUpState);
  const [currentPostTitle, setCurrentPostTitle] = useRecoilState(
    currentPostTitleState
  );
  const [currentPostText, setCurrentPostText] =
    useRecoilState(currentPostTextState);
  const quill = useRef(null);

  const qull_modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: [false, "large"] }, "bold", "italic", "underline", "strike"],
          [
            "blockquote",
            { list: "ordered" },
            { list: "bullet" },
            { align: [] },
            { color: [] },
          ],
          ["link", "image"],
        ],
        handlers: {
          image: () => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
              const file = input.files[0];
              console.log(file.size);
              if (file.size > maxSize) {
                alert("최대 크기 30MB만 가능");
                return;
              }
              const editor = quill.current.getEditor();
              const range = editor.getSelection();

              const url = await uploadURL(file);

              editor.insertEmbed(range.index, "image", `${url.data}`);
            };
          },
        },
      },
    };
  }, []);

  const onClickWriteFeed = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    setShowPopUp(true);
    setCurrentPopUp(CANCEL_FEED);
  };

  const handleSubmit = () => {
    setShowPopUp(true);
    setCurrentPopUp(WRITE_FEED);
    setCurrentPostTitle(title);
    setCurrentPostText(quill.current.getEditor().getContents());    
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="submit_wrapper">
      <div className="submit_header">
        <div className="submit_profilePic">
          <img
            src={user?.profile.profile_pic}
            alt="profile picture"
            style={{ width: "45px", height: "45px", borderRadius: "10px" }}
          />
        </div>
        <input
          type="text"
          value={title}
          onChange={onChangeTitle}
          placeholder={isOpen ? "Title" : "게시물 작성"}
          onClick={isOpen ? undefined : onClickWriteFeed}
          className="submit_title"
        />
      </div>
      <div>
        {isOpen ? (
          <div style={{ marginTop: "5px" }}>
            <ReactQuill
              ref={quill}
              modules={qull_modules}
              placeholder={"Text (Optional)"}
              theme="snow"
            />
            <div style={{ display: "flex", margin: "5px 0px" }}></div>
          </div>
        ) : (
          <div></div>
        )}
        <div className={isOpen ? "submit_switch2" : "submit_switch"}>
          <Button
            onClick={handleClick}
            data-index="0"
            sx={{
              backgroundColor: "lightgray",
              margin: "10px 10px",
              padding: "0 15px",
              color: "white",
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#26a7de",
              margin: "10px 0px",
              padding: "0 15px",
              color: "white",
            }}
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};
