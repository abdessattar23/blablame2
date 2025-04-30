import React from "react";
import Loader from "./loader";

const Loading = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <img src="blablame.png" alt="Loading..." />
        <div className="h-6"></div>
        <Loader />
      </div>
    </>
  );
};

export default Loading;
