import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { searchPost } from "../../api/FeedApi";
import { getUser } from "../../api/UserApi";
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
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="search_wrapper">
      <h1 className="search_title">검색한 키워드 : {keyword}</h1>
      <div>
        {posts?.map((post) => (
          <Feed
            key={post._id}
            post_id={post._id}
            writer_profile={post.user[0].profile}
            user_id={userQuery.data._id}
            caption={post.text}
            title={post.title}
            comments={post.comments}
            likes={post.likes[0]}
            likesCount={post.likes[0].liked_num}
          />
        ))}
      </div>
    </div>
  );
};
