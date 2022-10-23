import "./PopUp.css";

export const PopUp = ({ title, onClickSubmit, onClickCancel }) => {
  return (
    <div className="popup_wrapper">
      <h3 className="popup_title">{title}</h3>
      <div className="popup_btns">
        <button className="popup_btn" onClick={onClickSubmit}>
          확인
        </button>
        <button className="popup_btn" onClick={onClickCancel}>
          취소
        </button>
      </div>
    </div>
  );
};
