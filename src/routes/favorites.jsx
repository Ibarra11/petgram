import React from "react";
import Dog from "../components/Dog";
import Spinner from "../components/Spinner";
import DogSkeleton from "../components/DogSkeleton";
import useDogQuery from "../hooks/useDogQuery";

const fetchFavoriteDogs = async ({ pageParam }) => {
  const res = await fetch(
    `${import.meta.env.VITE_FAVORITES_URL}?api_key=${
      import.meta.env.VITE_API_KEY
    }&limit=12&page=${pageParam}&sub_id=${
      import.meta.env.VITE_SUB_ID
    }&order=DESC`
  );
  if (!res.ok) {
    throw new Error("Something went wrong with request");
  }
  return res.json();
};

export default function Favorites() {
  const { data, status, isFetching, hasNextPage } = useDogQuery(
    "favorites",
    fetchFavoriteDogs
  );

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
