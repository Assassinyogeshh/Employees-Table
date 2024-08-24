"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiTwotoneAppstore } from "react-icons/ai";

export default function Sidebar() {
  const currentRoute = usePathname();

  return (
    <ul className="w-[20%] p-5">
      <Link href="/">
        <li
          className={`${
            currentRoute === "/" ? "text-purple-500" : ""
          } text-[18px] h-[2.5rem] w-full font-[500] flex justify-start items-center cursor-pointer`}
        >
         <AiTwotoneAppstore className={`${currentRoute === "/" ? " bg-purple-600 rounded-sm" : "bg-black rounded-sm"} text-[24px] mr-2`} />
          <p>Overview</p>
        </li>
      </Link>
      <Link href="/users_Section">
        <li
          className={`${
            currentRoute === "/users_Section" ? "text-purple-500" : " "
          } text-[18px] h-[2.5rem] w-full font-[500] flex justify-start items-center cursor-pointer`}
        >
          <AiTwotoneAppstore className={`${currentRoute === "/users_Section" ? " bg-purple-600 rounded-sm" : "bg-black rounded-sm"} text-[24px] mr-2`} />
          <p>People Directory</p>
        </li>
      </Link>
    </ul>
  );
}
