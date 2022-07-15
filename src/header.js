import { Link } from 'react-router-dom';
import img from "./images/user.png";
import Avatar from "@material-ui/core/Avatar";
import {Modal, showModal} from "./Modal";
import add from "./images/addButton.png";
import { IconButton } from '@material-ui/core';

const handleClick = () => {
  showModal();
}

export function Header(props) {
  return (
      <div className="app__header">
        <div className="app__headerWrapper">
          <img
            src=" https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram original logo"
          />
          <div className="app__headerButtons">
          </div>
          <input
                type="image"
                src={add}
                alt="add Button"
                onClick={handleClick}
                className='addButton'
          />
          <Modal username={props.username} newPosts={props.newPosts}/>
          <IconButton size='small'>
          <Avatar
          className="post__avatar headerAva"
          alt={props.username}
          src={img}
        />
        </IconButton>
        </div>
      </div>
  );
}