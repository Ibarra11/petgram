import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import Spinner from "../components/Spinner";
import { useQueryClient } from "@tanstack/react-query";

export default function Root() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = React.useState(false);
  async function handleUpload(e) {
    setIsUploading(true);
    var myHeaders = new Headers();
    myHeaders.append("X-API-KEY", import.meta.env.VITE_API_KEY);

    var formdata = new FormData();
    formdata.append("file", e.target.files[0]);
    formdata.append("sub_id", import.meta.env.VITE_SUB_ID);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };

    fetch(import.meta.env.VITE_UPLOAD_URL, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        queryClient.invalidateQueries({ queryKey: ["uploadedDogs"] });
        setIsUploading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setIsUploading(false);
      });
  }
  return (
    <div className="flex gap-12  pt-16 px-12 min-h-screen bg-gray-100 overflow-clip items-start">
      <aside className="w-60 sticky top-4">
        <nav className="  mb-8">
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block py-2 text-center rounded ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "border border-gray-300"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `block py-2 text-center rounded ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "border border-gray-300"
                  }`
                }
              >
                Favorites
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/popular"
                className={({ isActive }) =>
                  `block py-2 text-center rounded ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "border border-gray-300"
                  }`
                }
              >
                Popular
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/uploaded"
                className={({ isActive }) =>
                  `block py-2 text-center rounded ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "border border-gray-300"
                  }`
                }
              >
                Uploaded
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="relative group  border border-gray-300">
          <input
            onChange={handleUpload}
            className="py-2  w-full opacity-0"
            accept="image/*"
            type="file"
          />
          <div className="absolute top-0 flex gap-2 items-center  justify-center w-full h-full pointer-events-none">
            {isUploading ? (
              <div className="w-full px-2 items-center text-gray-700 flex justify-between">
                Uploading
                <Spinner />
              </div>
            ) : (
              <>
                Upload
                <PlusIcon size={16} width={16} />
              </>
            )}
          </div>
        </div>
      </aside>

      <main className="relative flex-1 pb-20">
        <div className="columns-3 gap-3 space-y-10 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
