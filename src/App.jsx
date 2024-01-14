import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import Spinner from "./Spinner";

function App() {
  const fetchDogs = async ({ pageParam }) => {
    const res = await fetch(
      `${import.meta.env.VITE_SEARCH_URL}&limit=12&page=${pageParam}`
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
    <main className="relative bg-gray-100 min-h-screen pt-24 pb-20">
      <div className="columns-3 gap-3 max-w-7xl w-full mx-auto ">
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
  );
}

function Dog({ id, url }) {
  const [isVoting, setIsVoting] = React.useState(false);

  function handleVote(data) {
    return fetch(import.meta.env.VITE_VOTE_URL, {
      method: "POST",
      body: JSON.stringify({ ...data, sub_id: import.meta.env.VITE_SUB_ID }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async function handleUpVote() {
    try {
      setIsVoting(true);
      const body = {
        image_id: id,
        value: 1,
      };
      await handleVote(body);
    } catch (e) {
    } finally {
      setIsVoting(false);
    }
  }
  async function handleDownVote() {
    try {
      setIsVoting(true);
      const body = {
        image_id: id,
        value: -1,
      };
      await handleVote(body);
    } catch (e) {
    } finally {
      setIsVoting(false);
    }
  }
  return (
    <div className="relative rounded-lg mb-10 overflow-hidden">
      <img className="w-full" src={url} alt="a dog" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-60% to-black"></div>
      <div className="absolute bottom-4 w-full flex justify-between px-12 text-white">
        <button onClick={handleUpVote} className="hover hover:text-green-700">
          <HandThumbUpIcon height={24} width={24} />
        </button>
        <button onClick={handleDownVote} className="hover hover:text-red-700">
          <HandThumbDownIcon className="hover" height={24} width={24} />
        </button>
        {isVoting && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
