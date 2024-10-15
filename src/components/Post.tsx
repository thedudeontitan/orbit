import React from "react";
import { PostItem } from "../app/types";

export const Post: React.FC<PostItem> = ({ community, image, title }) => {
  return (
    <div className="p-4 flex flex-col gap-4 bg-[#ffffff12] rounded-lg flex-grow w-full">
      <div className="">
        <h1 className="text-xl font-bold">{title}</h1>
        <p>{community}</p>
      </div>
      {/* <div className="relative w-full lg:w-[62rem] h-[200px] lg:h-[80vh]"> */}
      <img src={image} alt="image" className="object-cover rounded-lg" />
      {/* </div> */}
    </div>
  );
};
