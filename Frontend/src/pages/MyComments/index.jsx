import { useQuery } from "react-query";
import { getUserComments } from "../../api/UserApi";
import { Loading } from "../../components/common/Loading";

import "./style.css";

export const MyComments = () => {
  const { data, isLoading } = useQuery("comments", getUserComments);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="myComments_wrapper">
      <h1>내가 작성한 댓글 목록</h1>
      <div className="myComments_comments_wrapper">
        {data.map((comment, index) => (
          <div className="myComments_comment_wrapper" key={index}>
            <h3>작성한 댓글 : {comment.caption}</h3>
            <h3 className="myComments_comment_date">
              수정된 날짜 : {new Date(comment.updatedAt).toLocaleString()}
            </h3>
            <h3 className="myComments_comment_date_minimize">
              수정된 날짜 :
              {new Date(comment.updatedAt).toLocaleString().slice(0, 11)}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
