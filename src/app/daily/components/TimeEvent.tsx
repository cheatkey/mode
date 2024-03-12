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

  return (
    <div ref={ref} className="flex flex-col gap-2 h-full">
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
  );
};

export default TimeEvent;
