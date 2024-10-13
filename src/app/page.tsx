import Link from "next/link";
import { Bet } from "../component/Bet";
import { Post } from "../component/Post";
import { Community } from "../component/types";
import Image from "next/image";

const Communities: Community[] = [
  { title: "Politics", image: "/images/community1.png" },
  { title: "Football", image: "/images/community1.png" },
  { title: "Hollywood", image: "/images/community1.png" },
  { title: "Basketball", image: "/images/community1.png" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 h-[20vh]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-[#ffffff12] text-[#D1D5DB] w-full rounded-lg"
          />
        ))}
      </div>
      <div className="flex flex-row gap-2 w-full">
        <div className="flex flex-col gap-2">
          <div className="lg:grid lg:grid-cols-2 flex flex-col gap-2 flex-grow">
            {Array.from({ length: 4 }).map((_, index) => (
              <Bet
                key={index}
                title="Sample Title"
                banner="/images/placeholder.png"
                outcomes={[
                  { id: "1", title: "Outcome 1" },
                  { id: "2", title: "Outcome 2" },
                ]}
                betEndTime={1234567890}
                description="Sample Description"
              />
            ))}
          </div>
          <div className="w-full">
            <Post
              title="Title"
              community="Community"
              image="/images/placeholder.png"
            />
          </div>
        </div>
        <div className="bg-[#ffffff12] w-[20rem] rounded-lg hidden lg:flex lg:flex-col h-fit py-4">
          <div className="pl-4 text-xs font-bold">Trending Communities</div>
          {Communities.map((item) => (
            <Link
              href="/"
              key={item.title}
              className="flex items-center justify-start h-14 px-4 hover:text-white transition"
            >
              <div className=" w-12 ">
                <div className="relative w-8 h-8">
                  <Image src={item.image} fill alt="" />
                </div>
              </div>
              <span className="ml-2">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
