"use client";
import { Community } from "@/app/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { CreateMarket } from "./CreateMarket";
import { CreatePost } from "./CreatePost";

const communities: Community[] = [
  { title: "Politics", image: "/images/community1.png" },
  { title: "Football", image: "/images/community1.png" },
  { title: "Hollywood", image: "/images/community1.png" },
  { title: "Basketball", image: "/images/community1.png" },
];

export default function Create() {
  const [postType, setPostType] = useState<"post" | "market">("post");
  const [community, setCommunity] = useState<string>("");

  const handleCommunityChange = (e: string) => {
    setCommunity(e);
  };

  return (
    <div className="bg-[#ffffff12] p-4 rounded-lg flex flex-col gap-4">
      <h1 className="text-2xl">Create Post</h1>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-500 pl-2 pr-4 py-2 rounded-lg inline-flex gap-2">
            {community === "" ? "Select Community" : community}
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 ml-16 bg-[#ffffff12] text-white backdrop-blur-2xl">
            <DropdownMenuLabel>Communities</DropdownMenuLabel>
            {communities.map((community) => (
              <DropdownMenuItem onClick={() => handleCommunityChange(community.title)} key={community.title}>
                <div className="flex items-center gap-2">
                  <img src={community.image} className="w-8 h-8" />
                  <span>{community.title}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="inline-flex">
        <button
          onClick={() => setPostType("post")}
          className={`px-4 py-2 font-bold ${postType === "post" ? "border-b-4 border-white" : ""}`}
        >
          Post
        </button>
        <button
          onClick={() => setPostType("market")}
          className={`px-4 py-2 font-bold ${postType === "market" ? "border-b-4 border-white" : ""}`}
        >
          Market
        </button>
      </div>
      {postType === "post" ? (
        <div>
          <CreatePost community={community} />
        </div>
      ) : (
        <div>
          <CreateMarket community={community} />
        </div>
      )}
    </div>
  );
}
