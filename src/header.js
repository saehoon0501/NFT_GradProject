import { Link } from 'react-router-dom';
import img from "./images/user.png";
import add from "./images/addButton.png";
import Avatar from "@material-ui/core/Avatar";



export function Header({ username }) {
  return (
      <div className="app__header">
        <div className="app__headerWrapper">
          <img
            src=" https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram original logo"
          />
          <button className="text__button">Logout</button>
          <div className="app__headerButtons">
            <button className="primary__button">Log in</button>
            <button className="text__button">Sign up</button>
          </div>
          <img
            src={add}
            alt="add Button"
          />
          <Avatar
          className="post__avatar"
          alt={username}
          src={img}
        />
        </div>
      </div>
  );
}