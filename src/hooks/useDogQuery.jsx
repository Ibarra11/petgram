import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAtBottom from "./useAtBottom";
export default function useDogQuery(queryKey, queryFn) {
  const isAtBottom = useAtBottom();
  React.useEffect(() => {
    if (isAtBottom && hasNextPage) {
      fetchNextPage();
    }
  }, [isAtBottom]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: queryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
}
