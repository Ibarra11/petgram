import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

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
      console.log(isAtBottom);
      if (isAtBottom && hasNextPage) {
        console.log("test");
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
    <main className="relative bg-slate-100 min-h-screen  pt-20 pb-8">
      <div className="grid  grid-cols-3 max-w-7xl w-full mx-auto gap-4">
        {data.pages.map((dogs, i) => {
          return (
            <React.Fragment key={i}>
              {dogs.map((dog) => (
                <Dog key={dog.id} {...dog} />
              ))}
            </React.Fragment>
          );
        })}
      </div>
      {isFetching && (
        <div className="absolute bottom-5 left-1/2 -translate-x-full">....</div>
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
