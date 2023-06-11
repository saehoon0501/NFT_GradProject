import "./LoginUser.css";

export const LoginUser = ({ users }) => {
  return (
    <div className="loginUser_wrapper">
      <h3 className="loginUser_title">{`현재 로그인 유저 (${users.length}명)`}</h3>
      <div className="loginUser_users">
        {users.map((user, index) => (
          <div key={index} className="loginUser_user">
            <img
              className="loginUser_user_img"
              src={user.profile_pic}
              alt={user.username}
            />
            <p className="loginUser_user_name">{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
