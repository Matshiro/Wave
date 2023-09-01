"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format, formatDistanceStrict } from "date-fns";
import pl from "date-fns/locale/pl";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

interface MessageBoxProps {
  isLast?: boolean;
  data: FullMessageType;
  timeBeforeLast?: Date;
}

function MessageBox({ isLast, data, timeBeforeLast }: MessageBoxProps) {
  const minutesBetweenTime = 5;
  if (timeBeforeLast === undefined) {
    timeBeforeLast = new Date("1970");
  }

  const session = useSession();

  const [mouseOver, setMouseOver] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const isIndividual = true;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const timeChecking = clsx("text-xs text-gray-400 flex justify-center");

  const container = clsx("flex gap-3 px-4 py-0", isOwn && "justify-end");

  const avatar = clsx(isIndividual && "hidden");

  const body = clsx("flex flex-col gap-1", isOwn && "items-end");

  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounder-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <div>
      {parseInt(
        formatDistanceStrict(new Date(data.createdAt), timeBeforeLast, {
          unit: "minute",
        })
      ) < minutesBetweenTime ? null : (
        <div className="text-xs text-gray-400 flex justify-center py-4">
          {format(new Date(data.createdAt), "p", { locale: pl })}{" "}
        </div>
      )}
      <div className={container}>
        <div className={avatar}>
          <Avatar user={data.sender} />
        </div>
        <div
          className={body}
          onMouseEnter={() => setMouseOver(true)}
          onMouseLeave={() => setMouseOver(false)}
        >
          <div className="relative flex items-center gap-1">
            <div className="text-sm text-gray-500">
              {isIndividual ? null : data.sender.name}
            </div>
          </div>
          <div
            className={clsx(
              "flex rounded-full gap-2",
              isOwn ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={message}>
              {/* na najechaniu pokazanie czasu wysłania */}
              {data.image ? (
                <Image
                  alt="Zdjęcie"
                  height={288}
                  width={288}
                  src={data.image}
                  className="object-cover cursor-pointer hover:scale-110 transition translate"
                />
              ) : (
                <div>{data.body}</div>
              )}
            </div>
            {mouseOver ? (
              <div className="py-2 px-3 bg-indigo-950 bg-opacity-70 rounded-md">
                <div className="text-gray-100 text-sm ">
                  {format(new Date(data.createdAt), "p", { locale: pl })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;
