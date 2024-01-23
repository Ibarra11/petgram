import React from "react";
import Spinner from "../components/Spinner";
import DogSkeleton from "../components/DogSkeleton";
import useDogQuery from "../hooks/useDogQuery";
import { DogWithActions } from "../components/DogWithActions";

const fetchDogs = async ({ pageParam }) => {
  const resForDogs = fetch(
    `${import.meta.env.VITE_SEARCH_URL}&limit=12&page=${pageParam}`
  ).then((res) => {
    if (!res.ok) {
      throw new Error();
    }
    return res.json();
  });
  const resForFavoritedDogs = fetch(
    `${import.meta.env.VITE_FAVORITES_URL}?api_key=${
      import.meta.env.VITE_API_KEY
    }&sub_id=${import.meta.env.VITE_SUB_ID}`
  ).then((res) => {
    if (!res.ok) {
      throw new Error();
    }
    return res.json();
  });
  const resForPopularDogs = await fetch(
    `${import.meta.env.VITE_VOTE_URL}`
  ).then((res) => {
    if (!res.ok) {
      throw new Error();
    }
    return res.json();
  });
  try {
    const [dogs, favoritedDogs, popularDogs] = await Promise.all([
      resForDogs,
      resForFavoritedDogs,
      resForPopularDogs,
    ]);

    return dogs.map((dog) => {
      const resultDog = { ...dog, votes: 0, liked: false };
      const popularDog = popularDogs.find(
        (popularDog) => popularDog.image_id === dog.id
      );
      if (popularDog) {
        resultDog.votes = popularDog.value;
      }
      const favoritedDog = favoritedDogs.find((d) => d.image_id === dog.id);
      if (favoritedDog) {
        resultDog.liked = true;
        resultDog.favoriteId = favoritedDog.id;
      }
      return resultDog;
    });
  } catch (e) {
    throw new Error();
  }
};

export default function Dogs() {
  const { data, hasNextPage, status, isFetching } = useDogQuery(
    "dogs",
    fetchDogs
  );

  return (
    <>
      {status === "pending" ? (
        <DogSkeleton count={9} />
      ) : (
        data.pages.map((dogs, i) => {
          return (
            <React.Fragment key={i}>
              {dogs.map(({ url, id, liked, votes, favoriteId }) => (
                <DogWithActions
                  liked={liked}
                  includeActions={true}
                  key={id}
                  imageId={id}
                  favoriteId={favoriteId}
                  url={url}
                  votes={votes}
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
