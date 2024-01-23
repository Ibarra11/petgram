import React from "react";
import Dog from "./Dog";

import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  HeartIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

import useDogMutation from "../hooks/useDogMutation";

function handleVote(data) {
  return fetch(`${import.meta.env.VITE_VOTE_URL}`, {
    method: "POST",
    body: JSON.stringify({ ...data, sub_id: import.meta.env.VITE_SUB_ID }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function DogWithActions({ imageId, favoriteId, url, liked, votes }) {
  async function handleUpvote() {
    const body = {
      image_id: imageId,
      value: votes + 1,
    };
    const res = await handleVote(body);
    if (!res.ok) {
      throw new Error("Something went wrong with request4");
    }
  }

  async function handleDownVote() {
    const body = {
      image_id: imageId,
      value: votes - 1,
    };
    const res = await handleVote(body);
    console.log(res);
    if (!res.ok) {
      throw new Error("Something went wrong with request");
    }
  }
  async function handleDeleteLike() {
    const res = await fetch(
      `${import.meta.env.VITE_FAVORITES_URL}/${favoriteId}?api_key=${
        import.meta.env.VITE_API_KEY
      }`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Somethint went wrong with the request");
    }
  }

  async function handleAddLike() {
    const res = await fetch(
      `${import.meta.env.VITE_FAVORITES_URL}?api_key=${
        import.meta.env.VITE_API_KEY
      }`,
      {
        method: "POST",
        body: JSON.stringify({
          image_id: imageId,
          sub_id: import.meta.env.VITE_SUB_ID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Somethint went wrong with the request");
    }
  }

  const upVoteMutation = useDogMutation(handleUpvote, { votes: votes + 1 });
  const downVoteMutation = useDogMutation(handleDownVote, { votes: votes - 1 });
  const addLikeMutation = useDogMutation(handleAddLike, { liked: true });
  const deleteLikeMutation = useDogMutation(handleDeleteLike, { liked: false });

  return (
    <Dog url={url}>
      <div className="flex justify-between items-center w-full ">
        <button
          onClick={() =>
            liked
              ? deleteLikeMutation.mutate({ imageId })
              : addLikeMutation.mutate({ imageId })
          }
          className="group"
        >
          <HeartIcon
            className={`transition-colors ${
              liked
                ? "fill-pink-500"
                : "fill-transparent stroke-gray-700 group-hover:fill-pink-500 group-hover:stroke-transparent"
            }`}
            height={24}
            width={24}
          />
        </button>
        <div className="flex gap-8 justify-between">
          <button
            onClick={() => upVoteMutation.mutate({ imageId })}
            className="group"
          >
            <HandThumbUpIcon
              className="fill-transparent stroke-gray-700 group-hover:fill-green-700 group-hover:stroke-transparent transition-colors"
              height={24}
              width={24}
            />
          </button>
          <button
            onClick={() => downVoteMutation.mutate({ imageId })}
            className="group"
          >
            <HandThumbDownIcon
              className="fill-transparent stroke-gray-700 group-hover:fill-red-700 group-hover:stroke-transparent transition-colors"
              height={24}
              width={24}
            />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <ChartBarIcon className="fill-gray-700" height={24} width={24} />
          <span className="font-medium">{votes}</span>
        </div>
      </div>
    </Dog>
  );
}
