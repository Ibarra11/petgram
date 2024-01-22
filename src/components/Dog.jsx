import React from "react";
import Spinner from "./Spinner";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  HeartIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";

function handleVote(data) {
  return fetch(import.meta.env.VITE_VOTE_URL, {
    method: "POST",
    body: JSON.stringify({ ...data, sub_id: import.meta.env.VITE_SUB_ID }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default function Dog({
  imageId,
  favoriteId,
  url,
  includeActions,
  liked,
  score,
}) {
  const queryClient = useQueryClient();
  const [isPending, setisPending] = React.useState(false);

  async function handleUpVote() {
    setisPending(true);
    try {
      const body = {
        image_id: imageId,
        value: score + 1,
      };
      await handleVote(body);
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
    } catch (e) {
      console.error(e);
    } finally {
      setisPending(false);
    }
  }

  async function handleDownVote() {
    setisPending(true);
    try {
      const body = {
        image_id: imageId,
        value: score - 1,
      };
      await handleVote(body);
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
    } catch (e) {
      console.error(e);
    } finally {
      setisPending(false);
    }
  }

  async function handleDeleteLike() {
    try {
      await fetch(
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
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
    } catch (e) {
      console.error(e);
    } finally {
      setisPending(false);
    }
  }

  async function handleLike() {
    try {
      await fetch(
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
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
    } catch (e) {
    } finally {
      setisPending(false);
    }
  }

  return (
    <div className="relative rounded-lg overflow-hidden break-inside-avoid">
      <img
        className="w-full hover:scale-105 transition-transform"
        src={url}
        alt="a dog"
      />
      {includeActions && (
        <div className=" flex justify-between items-center border border-gray-200 py-4 px-4">
          <button
            onClick={liked ? handleDeleteLike : handleLike}
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
            <button onClick={handleUpVote} className="group">
              <HandThumbUpIcon
                className="fill-transparent stroke-gray-700 group-hover:fill-green-700 group-hover:stroke-transparent transition-colors"
                height={24}
                width={24}
              />
            </button>
            <button onClick={handleDownVote} className="group">
              <HandThumbDownIcon
                className="fill-transparent stroke-gray-700 group-hover:fill-red-700 group-hover:stroke-transparent transition-colors"
                height={24}
                width={24}
              />
            </button>
            {isPending && (
              <div className="absolute left-1/2 -translate-x-1/2">
                <Spinner />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <ChartBarIcon className="fill-gray-700" height={24} width={24} />
            <span className="font-medium">{score}</span>
          </div>
        </div>
      )}
    </div>
  );
}
