import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAtBottom from "../hooks/useAtBottom";
import Dog from "../components/Dog";
import Spinner from "../components/Spinner";
import DogSkeleton from "../components/DogSkeleton";
export default function Favorites() {
  const fetchFavoriteDogs = async ({ pageParam }) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_FAVORITES_URL
      }&limit=12&page=${pageParam}&sub_id=${import.meta.env.VITE_SUB_ID}`
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
    queryKey: ["favoriteDogs"],
    queryFn: fetchFavoriteDogs,
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

  return (
    <>
      {status === "pending" ? (
        <DogSkeleton count={9} />
      ) : (
        data.pages.map((dogs, i) => {
          return (
            <React.Fragment key={i}>
              {dogs.map(({ image, id }) => (
                <Dog
                  includeActions={false}
                  key={id}
                  id={image.id}
                  url={image.url}
                />
              ))}
            </React.Fragment>
          );
        })
      )}
      {isFetching && hasNextPage && (
        <div className="absolute bottom-10 translate-y-1/2 left-1/2 -translate-x-1/2">
          <Spinner />
        </div>
      )}
    </>
  );
}
