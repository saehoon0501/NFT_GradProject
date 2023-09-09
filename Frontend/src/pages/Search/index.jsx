import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { searchPost } from "../../api/FeedApi";
import { getUser } from "../../api/UserApi";
import { Loading } from "../../components/common/Loading";
import Feed from "../../components/main/Feed";

import "./style.css";

export const Search = () => {
  const { keyword } = useParams();
  const [posts, setPosts] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const userQuery = useQuery("user", ({ signal }) => getUser(signal));

  useEffect(async () => {
    const data = await searchPost(keyword);
    console.log(data);
    setPosts(data);
    setIsLoading(false);
  }, [keyword]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="search_wrapper">
      <h1 className="search_title">검색한 키워드 : {keyword}</h1>
      <div>
        {posts?.map((post, index) => (
          <Feed
            key={post._id + index}
            post_id={post.post_id}
            user_id={userQuery.data ? userQuery.data._id : " "}
            postUser={post.user}
            user_role={userQuery.data ? userQuery.data.role : " "}
            caption={post.text}
            title={post.title}
            comments={post.comments}
            likes={post.like}
            // socketValue={socketValue}
            createdAt={post.createdAt}
          />
        ))}
      </div>
    </div>
  );
};
