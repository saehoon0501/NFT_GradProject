import "./LoginUser.css";

const dummyData = [
  {
    imgUrl:
      "https://img1.daumcdn.net/thumb/S180x180/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fsports%2Fplayer%2F300%2F3%2F9552.jpg&scode=default_face_profile_big_p",
    name: "무키 베츠",
  },
  {
    imgUrl:
      "https://img1.daumcdn.net/thumb/S180x180/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fsports%2Fplayer%2F300%2F3%2F310056.jpg&scode=default_face_profile_big_p",
    name: "트레이 터너",
  },
  {
    imgUrl:
      "http://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/30193.png",
    name: "프레디 프리먼",
  },
];

export const LoginUser = () => {
  return (
    <div className="loginUser_wrapper">
      <h3 className="loginUser_title">현재 로그인 유저</h3>
      <div className="loginUser_users">
        {dummyData.map((user, index) => (
          <div key={index} className="loginUser_user">
            <img
              className="loginUser_user_img"
              src={user.imgUrl}
              alt={user.name}
            />
            <p className="loginUser_user_name">{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
