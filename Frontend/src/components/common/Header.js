import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useQuery } from "react-query";

import "./Header.css";
import { getUser } from "../../api/UserApi";
import { isLoginState } from "../../store";

export const Header = (props) => {
  const [isAuth, setIsAuth] = useRecoilState(isLoginState);
  const navigate = useNavigate();
  const { data: user } = useQuery("user", ({ signal }) => getUser(signal));

  const showProfile = () => {
    navigate("/profile");
  };

  const showSns = () => {
    navigate("/");
  };

  return (
    <>
      {!isAuth && (
        <div className="wrapper">
          <img
            src=" https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram original logo"
            onClick={showSns}
          />
          <img
            onClick={showProfile}
            className="profile_img"
            src={user?.profile.profile_pic}
            alt="profile picture"
          />
        </div>
      )}
    </>
  );
};
