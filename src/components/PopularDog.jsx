import { ChartBarIcon } from "@heroicons/react/24/solid";
import Dog from "./Dog";
export default function PopularDog({ votes, url }) {
  return (
    <Dog url={url}>
      <div className="flex justify-center gap-1 items-center w-full border border-gray-200 py-4 px-4">
        <ChartBarIcon className="fill-gray-700" height={24} width={24} />
        <span className="font-medium">{votes}</span>
      </div>
    </Dog>
  );
}
