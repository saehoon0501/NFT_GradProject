import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { searchPost } from "../../api/FeedApi";
import { getUser } from "../../api/UserApi";
import Feed from "../../components/main/Feed";

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

  console.log(posts);

  return (
    <div>
      <h1>검색한 키워드 : {keyword}</h1>
      <div>
        {posts?.map((post) => (
          <Feed
            key={post._id}
            post_id={post._id}
            writer_profile={post.user.profile}
            user_id={userQuery.data._id}
            caption={post.text}
            title={post.title}
            comments={post.comments}
            likes={post.likes}
          />
          //   <Feed
          //     key={post._id}
          //     post_id={post._id}
          //     writer_profile={post.user.profile}
          //     user_id={post._id}
          //     caption={post.text}
          //     title={post.title}
          //     comments={post.comments}
          //     likes={post.likes}
          //   />
          //   <h1>{post.title}</h1>
        ))}
      </div>
    </div>
  );
};
