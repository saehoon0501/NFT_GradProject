import img from "./images/user.png";
import {Modal, showModal} from "./Modal";
import add from "./images/addButton.png";
import { IconButton } from '@material-ui/core';
import "./Profile.css"

const handleClick = () => {
  showModal();
}



export function Header(props) {

  const showProfile = () => {
    props.openProfile(true);
  }
  
  const showSns = () => {
    props.openProfile(false);
  }

  return (
      <div className="app__header">
        <div className="app__headerWrapper">
          <img className="clickable"
            src=" https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram original logo"
            onClick={showSns}
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
          <IconButton size='small' onClick={showProfile} style={{marginLeft:"50px", backgroundColor:"transparent"}}>
        <img 
          src={props.pic}
          alt="profile picture"
          style={{width:"40px",borderRadius:"20px"}}
        />
        </IconButton>
        </div>
      </div>
  );
}