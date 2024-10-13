import React from "react";
import { Market } from "./types";
import { ConvertToDate } from "../utils/ConvertToDate";
import Image from "next/image";

export const Bet: React.FC<Market> = ({
  banner,
  betEndTime,
  outcomes,
  title,
  description,
}) => {
  return (
    <div className="rounded-lg flex flex-col gap-2 bg-[#ffffff12] text-[#D1D5DB] p-4 w-full">
      <div className="flex flex-row gap-2">
        <div className="relative w-[6rem] h-[4rem]">
          <Image src={banner} alt="" className="object-cover rounded-lg" fill />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-semibold">{title}</h1>
          <p className="text-xs">{description}</p>
          <p className="text-xs">End Date: {ConvertToDate(betEndTime)}</p>
        </div>
      </div>
      <div className="flex flex-row gap-2 w-full">
        <button className="bg-[#34c38f2e] border border-[#34c38f] border-opacity-50 text-[#34c38f] flex-grow rounded">
          Yes
        </button>
        <button className="bg-[#f443362e] border border-[#f44336] border-opacity-50 text-[#f44336] flex-grow rounded">
          No
        </button>
      </div>
    </div>
  );
};
