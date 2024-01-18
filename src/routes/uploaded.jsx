import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAtBottom from "../hooks/useAtBottom";
import Dog from "../components/Dog";
import Spinner from "../components/Spinner";
export default function UploadedDogs() {
  const fetchDogs = async ({ pageParam }) => {
    const res = await fetch(
      `${import.meta.env.VITE_UPLOADED_URL}&limit=12&sub_id=${
        import.meta.env.VITE_SUB_ID
      }&page=${pageParam}`
    );
    if (!res.ok) {
      throw new Error("Something went wrong with request");
    }
    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["uploadedDogs"],
    queryFn: fetchDogs,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
  const isAtBottom = useAtBottom();

  React.useEffect(() => {
    if (isAtBottom && hasNextPage) {
      fetchNextPage();
    }
  }, [isAtBottom]);

  if (status === "pending") {
    return <p>Pending</p>;
  }
  if (status === "error") {
    return <p>{error.message}</p>;
  }
  return (
    <>
      {data.pages.map((dogs, i) => {
        return (
          <React.Fragment key={i}>
            {dogs.map(({ url, id }) => (
              <Dog includeActions={false} key={id} id={id} url={url} />
            ))}
          </React.Fragment>
        );
      })}
      {isFetching && (
        <div className="absolute bottom-10 translate-y-1/2 left-1/2 -translate-x-1/2">
          <Spinner />
        </div>
      )}
    </>
  );
}
