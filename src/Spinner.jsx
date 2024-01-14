export default function Spinner({ className }) {
  return (
    <div className="relative overflow-hidden flex items-center justify-center  w-8 h-8 rounded-full bg-slate-300">
      <div className="absolute w-8 h-8 origin-left -right-4 animate-spin  rounded-full  bg-slate-500"></div>
      <div className="absolute bg-slate-100 w-6 h-6 rounded-full "></div>
    </div>
  );
}
