function randomSize() {
  const width = Math.floor(Math.random() * 100) + 350;
  const height = Math.floor(Math.random() * 100) + 350;
  return { width, height };
}
export default function DogSkeleton({ count }) {
  return (
    <>
      {new Array(count).fill().map((_, i) => {
        const { width, height } = randomSize();
        return (
          <div
            style={{ width, height }}
            key={i}
            className={`relative rounded-lg break-inside-avoid animate-pulse bg-gray-700`}
          ></div>
        );
      })}
    </>
  );
}
