import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPosts = async (page: number): Promise<Post[]> => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
  );
  return data;
};

const App = () => {
  const [page, setPage] = useState(1);
  const { data, isError, isPending, isPlaceholderData, isFetching } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page),
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      {isPending ? (
        "Loading..."
      ) : isError ? (
        "An error has occurred."
      ) : (
        <>
          {data?.map((post: Post) => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
          ))}
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Previous Page
          </button>
          <button
            onClick={() => {
              if (!isPlaceholderData) {
                setPage((old) => old + 1);
              }
            }}
            // Disable the Next Page button until we know a next page is available
            disabled={isPlaceholderData}
          >
            Next Page
          </button>
          {isFetching ? <p>Loading ...</p> : null}
        </>
      )}
    </div>
  );
};

export default App;
