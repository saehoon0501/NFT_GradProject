import { useQuery } from "react-query";
import { getUserComments } from "../../api/UserApi";
import { Loading } from "../../components/common/Loading";
import { elapsedTimePeriod } from "../../utils";

import "./style.css";

export const MyComments = () => {
  const { data, isLoading } = useQuery("comments", getUserComments);

  if (isLoading) {
    return <Loading />;
  }

  console.log(data);

  return (
    <div className="myComments_wrapper">
      <h1>내가 작성한 댓글 목록</h1>
      <div className="myComments_comments_wrapper">
        {data.map((comment, index) => (
          <div className="myComments_comment_wrapper" key={index}>
            <h3>작성한 댓글 : {comment.context}</h3>
            <h3 className="myComments_comment_date_minimize">
              {elapsedTimePeriod(comment.updatedAt)}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
