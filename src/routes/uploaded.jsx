import React from "react";
import Dog from "../components/Dog";
import Spinner from "../components/Spinner";
import DogSkeleton from "../components/DogSkeleton";
import useDogQuery from "../hooks/useDogQuery";
export default function UploadedDogs() {
  const fetchUploadedDogs = async ({ pageParam }) => {
    const res = await Promise.any([
      fetch(
        `${import.meta.env.VITE_UPLOADED_URL}&limit=12&sub_id=${
          import.meta.env.VITE_SUB_ID
        }&page=${pageParam}`
      ),
    ]);

    if (!res.ok) {
      throw new Error("Something went wrong with request");
    }
    return res.json();
  };

  const { data, hasNextPage, isFetching, status } = useDogQuery(
    "uploadedDogs",
    fetchUploadedDogs
  );

  return (
    <>
      {status === "pending" ? (
        <DogSkeleton count={9} />
      ) : (
        data.pages.map((dogs, i) => {
          return (
            <React.Fragment key={i}>
              {dogs.map(({ url, id }) => (
                <Dog key={id} url={url} />
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
