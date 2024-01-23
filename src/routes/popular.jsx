import React from "react";

import Dog from "../components/Dog";
import Spinner from "../components/Spinner";
import DogSkeleton from "../components/DogSkeleton";
import useDogQuery from "../hooks/useDogQuery";
import PopularDog from "../components/PopularDog";
const fetchPopularDogs = async ({ pageParam }) => {
  const res = await fetch(
    `${import.meta.env.VITE_VOTE_URL}&limit=12&page=${pageParam}`
  );
  if (!res.ok) {
    throw new Error("Something went wrong with request");
  }
  return res.json();
};
export default function Popular() {
  const { data, status, isFetching, hasNextPage } = useDogQuery(
    "popularDogs",
    fetchPopularDogs
  );
  return (
    <>
      {status === "pending" || isFetching ? (
        <DogSkeleton count={9} />
      ) : (
        data.pages.map((dogs, i) => {
          return (
            <React.Fragment key={i}>
              {dogs.map(({ image, id, value }) => (
                <PopularDog votes={value} key={id} url={image.url} />
              ))}
            </React.Fragment>
          );
        })
      )}
      {hasNextPage && (
        <div className="absolute bottom-10 translate-y-1/2 left-1/2 -translate-x-1/2">
          <Spinner />
        </div>
      )}
    </>
  );
}
