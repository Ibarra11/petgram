import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Dog from "./Dog";
import Spinner from "./Spinner";

function App() {
  const fetchDogs = async ({ pageParam }) => {
    const res = await fetch(
      `${import.meta.env.VITE_SEARCH_URL}&limit=12&page=${pageParam}`
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
    queryKey: ["dogs"],
    queryFn: fetchDogs,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  React.useEffect(() => {
    function handleScroll() {
      // - 40 to account for padding
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 40;
      if (isAtBottom && hasNextPage) {
        fetchNextPage();
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (status === "pending") {
    return <p>Pending</p>;
  }
  if (status === "error") {
    return <p>{error.message}</p>;
  }

  return (
    <div className="flex gap-12 h-screen overflow-auto  pt-16 px-12 bg-gray-100">
      <aside className="w-60">
        <nav>
          <ul>
            <li>Home</li>
            <li>Favorites</li>
            <li>Popular</li>
          </ul>
        </nav>
      </aside>
      <main className="relative overflow-y-auto flex-1 pb-20">
        <div className="columns-3 gap-3  ">
          {data.pages.map((dogs, i) => {
            return (
              <React.Fragment key={i}>
                {dogs.map(({ url, id }) => (
                  <Dog key={id} id={id} url={url} />
                ))}
              </React.Fragment>
            );
          })}
        </div>
        {isFetching && (
          <div className="absolute bottom-10 translate-y-1/2 left-1/2 -translate-x-1/2">
            <Spinner />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
