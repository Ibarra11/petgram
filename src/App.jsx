import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";

function App() {
  const fetchDogs = async ({ pageParam }) => {
    const res = await fetch(
      import.meta.env.VITE_BASE_URL +
        `?api_key=${import.meta.env.VITE_API_KEY}&limit=12&page=${pageParam}`
    );
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
    <main className="relative bg-slate-100 min-h-screen pt-24 pb-20">
      <div className="columns-3 gap-3 max-w-7xl w-full mx-auto ">
        {data.pages.map((dogs, i) => {
          return (
            <React.Fragment key={i}>
              {dogs.map(({ url }) => (
                <img
                  className="w-full mb-10 rounded-lg"
                  src={url}
                  alt="a dog"
                />
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
  );
}

function Dog({ url }) {
  return (
    <div className="h-96">
      <img className="w-full h-full object-contain" src={url} alt="a dog" />
    </div>
  );
}

export default App;
