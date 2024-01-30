import { useEffect, useState } from "react";

const LoadingInTable = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [time]);

  return (
    <>
      {time < 5 ? (
        <div className=" flex items-center justify-center gap-2">
          <div
            style={{ borderTopColor: "transparent" }}
            className="w-5 h-5 border-4 border-white rounded-full animate-spin"
          ></div>
          <span className="text-bold text-white text-lg">Loading...</span>
        </div>
      ) : (
        <div className="text-bold text-white text-lg">No data</div>
      )}
    </>
  );
};

export default LoadingInTable;
