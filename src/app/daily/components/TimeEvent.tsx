import React, { useState } from "react";
import { useDebounce, useMeasure } from "react-use";
import { format } from "date-fns/format";
import { trpc } from "@/server/trpc";

interface TimeEventProps {
  event: {
    start: Date;
    end: Date;
    id: number;
    taskId: null;
    title: string;
  };
}

const TimeEvent = ({ event }: TimeEventProps) => {
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const [title, setTitle] = useState<string>(event.title);

  const [, cancel] = useDebounce(
    () => {
      trpc.timeblock.updateTimeblock.mutate({
        id: event.id,
        data: {
          title: title,
        },
      });
    },
    500,
    [title]
  );

  //   background: #1a1a1a;
  //   border: 2px solid #ab68ff !important;
  //   border-radius: 15px;
  //   padding: 20px;

  return (
    <div ref={ref} className="h-full">
      {height < 80 ? (
        <div
          className={`flex flex-row gap-2 h-full items-center bg-[#1a1a1a] border-2 border-[#ab68ff] px-5 py-1 ${
            height < 25 ? "rounded-md" : "rounded-xl"
          }`}
        >
          <input
            className="text-gray-100 text-lg font-bold tracking-tight bg-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-gray-200 text-base">
            {format(event.start, "HH:mm")} ~ {format(event.end, "HH:mm")}{" "}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 h-full p-5 bg-[#1a1a1a] border-2 border-[#ab68ff] rounded-xl">
          <div className="flex flex-col">
            <input
              className="text-gray-100 text-lg font-bold tracking-tight bg-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <p className="text-gray-200 text-base">
              {format(event.start, "HH:mm")} ~ {format(event.end, "HH:mm")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeEvent;
