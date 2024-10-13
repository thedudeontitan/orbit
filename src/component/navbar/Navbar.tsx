import { ReactNode } from "react";
import { Community, NavItem } from "../types";
import { MdOutlineHome, MdSettings } from "react-icons/md";
import { MdOutlinePieChart } from "react-icons/md";
import { MdOutlineGroup } from "react-icons/md";
import { MdOutlinePerson } from "react-icons/md";
import Link from "next/link";
import { MdAdd } from "react-icons/md";

const navItems: NavItem[] = [
  { title: "Home", icon: <MdOutlineHome /> },
  { title: "Market", icon: <MdOutlinePieChart /> },
  { title: "Communities", icon: <MdOutlineGroup /> },
  { title: "Profile", icon: <MdOutlinePerson /> },
];

const navItems2: Community[] = [
  { title: "Politics", image: "/images/community1.png" },
  { title: "Football", image: "/images/community1.png" },
  { title: "Hollywood", image: "/images/community1.png" },
  { title: "Basketball", image: "/images/community1.png" },
];

export default function Navbar() {
  return (
    <div>
      <div>
        <div className="hidden lg:flex lg:flex-col gap-2 text-sm fixed top-2 bottom-2 left-2">
          <div className="bg-[#ffffff12] text-[#D1D5DB] w-[14rem] rounded-lg">
            {navItems.map((item) => (
              <Link
                href="/"
                key={item.title}
                className="flex items-center justify-start h-14 px-4 hover:text-white transition"
              >
                <span className="w-12 text-xl">{item.icon}</span>
                <span className="ml-2">{item.title}</span>
              </Link>
            ))}
          </div>
          <div className="bg-[#ffffff12] text-[#D1D5DB] w-[14rem] rounded-lg flex-grow justify-between flex flex-col">
            <div>
              <div className="pt-4 pl-4 text-xs font-bold">Communities</div>
              {navItems2.map((item) => (
                <Link
                  href="/"
                  key={item.title}
                  className="flex items-center justify-start h-14 px-4 hover:text-white transition"
                >
                  <div className=" w-12 ">
                    <img src={item.image} className="w-8 text-xl" />
                  </div>
                  <span className="ml-2">{item.title}</span>
                </Link>
              ))}
            </div>

            <Link
              href="/settings"
              className="flex items-center justify-start h-14 px-4 hover:text-white transition"
            >
              <span className="w-12 text-xl">
                <MdSettings />
              </span>
              <span className="ml-2">Settings</span>
            </Link>
          </div>
        </div>
      </div>
      <div className=" fixed bottom-0 left-0 right-0 bg-[#ffffff12] text-[#D1D5DB]">
        <div className="relative flex flex-row lg:hidden justify-around items-center">
          <Link href="/" className="p-5">
            <span className="text-xl">
              <MdOutlineHome />
            </span>
          </Link>
          <Link href="/" className="mr-6 p-5">
            <span className="text-xl">
              <MdOutlinePieChart />
            </span>
          </Link>
          <Link
            href="/"
            className="p-4 absolute -top-1/2 bg-blue-600 rounded-full"
          >
            <span className="text-xl">
              <MdAdd />
            </span>
          </Link>
          <Link href="/" className="ml-6 p-5">
            <span className="text-xl">
              <MdOutlineGroup />
            </span>
          </Link>
          <Link href="/" className="p-5">
            <span className="text-xl">
              <MdOutlinePerson />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
