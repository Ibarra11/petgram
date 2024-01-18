import React from "react";
import Spinner from "./Spinner";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
export default function Dog({ id, url, includeActions }) {
  const [isPending, setisPending] = React.useState(false);

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
      setisPending(true);
      const body = {
        image_id: id,
        value: 1,
      };
      await handleVote(body);
    } catch (e) {
    } finally {
      setisPending(false);
      updateLocalStorage({ id });
    }
  }
  async function handleDownVote() {
    try {
      setisPending(true);
      const body = {
        image_id: id,
        value: -1,
      };
      await handleVote(body);
    } catch (e) {
    } finally {
      setisPending(false);
    }
  }
  async function handleLike() {
    try {
      await fetch(import.meta.env.VITE_FAVORITES_URL, {
        method: "POST",
        body: JSON.stringify({
          image_id: id,
          sub_id: import.meta.env.VITE_SUB_ID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
    } finally {
      setisPending(false);
    }
  }

  return (
    <div className="relative rounded-lg break-inside-avoid">
      <img className="w-full" src={url} alt="a dog" />
      {includeActions && (
        <div className=" flex justify-between items-center border border-gray-200 py-4 px-4">
          <button onClick={handleLike} className="group">
            <HeartIcon
              className="fill-transparent stroke-gray-700 group-hover:fill-pink-500 group-hover:stroke-transparent transition-colors"
              height={24}
              width={24}
            />
          </button>
          <div className="flex gap-4 justify-between">
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
        </div>
      )}
    </div>
  );
}
