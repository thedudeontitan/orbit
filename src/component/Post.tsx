import React from "react";
import { PostItem } from "./types";

export const Post: React.FC<PostItem> = ({ community, image, title }) => {
  return (
    <div className="p-4 flex flex-col gap-4 bg-[#ffffff12] rounded-lg">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p>{community}</p>
      </div>
      <img src={image} alt="" className="w-full object-contain rounded-lg" />
    </div>
  );
};
