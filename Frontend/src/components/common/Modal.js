import { useState } from "react";
import React from "react";
import "./Modal.css";
import Avatar from "@mui/material/Avatar";
import img from "../../assets/user.png";

export const showModal = () => {
  let modal = document.getElementById("myModal");
  modal.style.display = "block";
};

const ImageResize = (props) => {
  let caption = "";

  const [resize, resetSize] = useState(false);

  const handleUpdate = (e) => {
    caption = e.target.value;
  };

  const handlePost = () => {
    props.newPosts({
      username: props.username,
      caption: caption,
      image: props.img,
    });
    props.close();
  };

  const handleSize = () => {
    resetSize(true);
  };

  return (
    <div id="ImgResize" class={resize ? "modal-content2" : "modal-content"}>
      <div
        style={{
          borderColor: "black",
          marginTop: "10px",
          width: "100%",
          height: "40px",
          borderBottom: "solid 1px lightgray",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{ marginRight: "10px", fontSize: "15px", color: "blueviolet" }}
          class="close"
          onClick={resize ? handlePost : handleSize}
        >
          {resize ? "공유하기" : "다음"}
        </span>
        <h3 style={{ marginLeft: "35px" }}>이미지 크기 조정</h3>
      </div>
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div
          id="selectedImg"
          style={{
            width: "855px",
            height: "805px",
            borderRadius: "0 0 2ex 2ex",
            backgroundImage: `url(${URL.createObjectURL(props.img)})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "cetner",
          }}
        ></div>
        {resize && (
          <div style={{ display: "block", width: "339px" }}>
            <div
              style={{ display: "flex", alignItems: "center", margin: "10px" }}
            >
              <div>
                <Avatar
                  className="post__avatar headerAva"
                  alt={"byun0501"}
                  src={img}
                />
              </div>
              <div>
                <h3>{"byun0501"}</h3>
              </div>
            </div>
            <div>
              <form>
                <textarea
                  aria-label="문구입력..."
                  placeholder="문구입력..."
                  autoComplete="off"
                  autoCorrect="off"
                  onChange={(event) => {
                    handleUpdate(event);
                  }}
                  style={{
                    padding: "10px",
                    resize: "none",
                    width: "100%",
                    height: "300px",
                    border: "0",
                    outline: "none",
                  }}
                ></textarea>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Modal = (props) => {
  const [selectedImage, setImage] = useState(null);

  const handleClose = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
    setImage(null);
  };

  window.onclick = (e) => {
    let modal = document.getElementById("myModal");
    if (e.target == modal) {
      modal.style.display = "none";
      setImage(null);
      let resize = document.getElementById("ImgResize");
      resize.style.width = "600px";
    }
  };

  return (
    <div id="myModal" class="modal">
      {selectedImage == null ? (
        <div id="ImgResize" class="modal-content">
          <div
            style={{
              borderColor: "black",
              marginTop: "10px",
              width: "100%",
              height: "40px",
              borderBottom: "solid 1px lightgray",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{ marginRight: "10px" }}
              class="close"
              onClick={handleClose}
            >
              &times;
            </span>
            <h3 style={{ marginLeft: "30px" }}>이미지를 추가해주세요</h3>
          </div>
          <div>
            <input
              type="file"
              class="modal-input"
              onChange={(event) => {
                setImage(event.target.files[0]);
              }}
            />
          </div>
        </div>
      ) : (
        <ImageResize
          img={selectedImage}
          username={props.username}
          newPosts={props.newPosts}
          close={handleClose}
        />
      )}
    </div>
  );
};
