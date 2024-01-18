import React from "react";
export default function useAtBottom() {
  const [isAtBottom, setIsAtBottom] = React.useState();
  React.useEffect(() => {
    function handleScroll() {
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 40;
      if (isAtBottom) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return isAtBottom;
}
