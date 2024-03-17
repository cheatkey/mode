import React, { useRef, useState } from "react";
import { useClickAway, useDebounce, useMeasure } from "react-use";
import { format } from "date-fns/format";
import { trpc } from "@/server/trpc";
import useCustomContextMenu from "./hooks/useCustomContextMenu";
import { mergeRefs } from "react-merge-refs";
import TaskSelector from "./TaskSelector";

interface TimeEventProps {
  event: {
    start: Date;
    end: Date;
    id: number;
    taskId: null;
    title: string;
  };
  doFetch: () => Promise<void>;
}

const TimeEvent = ({ event, doFetch }: TimeEventProps) => {
  const { handleContextMenu, visible, position, setVisible } =
    useCustomContextMenu();
  const [measureRef, { height }] = useMeasure<HTMLDivElement>();
  const [title, setTitle] = useState<string>(event.title);
  const ref = useRef<HTMLDivElement>(null);

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

  useClickAway(ref, () => {
    setVisible(false);
  });

  return (
    <div ref={measureRef} className="h-full" onContextMenu={handleContextMenu}>
      {height < 80 ? (
        <div
          className={`flex flex-row gap-2 h-full items-center bg-[#1a1a1a] border-2 border-[#ab68ff] px-5 py-1 ${
            height < 25 ? "rounded-md" : "rounded-xl"
          }`}
        >
          <input
            className={`text-gray-100 font-bold tracking-tight bg-transparent ${
              height < 25 ? "text-lg" : "text-lg"
            }`}
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

      {visible && (
        <div
          ref={ref}
          className="bg-gray-800 z-50 py-3 px-4 rounded-lg min-w-40 flex flex-col gap-2"
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
          }}
        >
          {/* <p className="font-bold text-lg">연결된 작업 없음</p> */}
          <TaskSelector />
          <p
            onClick={async () => {
              await trpc.timeblock.deleteTimeblock.mutate({
                id: event.id,
              });
              await doFetch();
            }}
          >
            삭제
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeEvent;
