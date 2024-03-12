"use client";
import { FC, use, useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CalendarProps,
  dateFnsLocalizer,
  Event,
  EventPropGetter,
  SlotInfo,
} from "react-big-calendar";
import withDragAndDrop, {
  DragFromOutsideItemArgs,
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { format } from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import addHours from "date-fns/addHours";
import startOfHour from "date-fns/startOfHour";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import { nanoid } from "nanoid";
import { cloneDeep } from "lodash-es";
import { trpc } from "@/server/trpc";
import { revalidatePath } from "next/cache";
import { useAsyncFn, useMount } from "react-use";
import TimeEvent from "./TimeEvent";
import dayjs from "dayjs";

interface TimeBlockingProps {}

const TimeBlocking = ({}: TimeBlockingProps) => {
  const [draggedEvent, setDraggedEvent] = useState<{
    time?: number;
    title: string;
  } | null>(null);

  const [serverEvents, doFetch] = useAsyncFn(async () => {
    const data = await trpc.timeblock.getDailyTimeblocks.query({
      date: "2024/3/13",
    });
    console.log("data:", data);
    return data;
  }, []);

  const updateTimeblock = useCallback(
    async (id: number, data: { start?: Date; end?: Date }) => {
      await trpc.timeblock.updateTimeblock.mutate({
        id,
        data: {
          start: data.start,
          end: data.end,
        },
      });
      await doFetch();
    },
    [doFetch]
  );

  useMount(() => {
    doFetch();
  });

  const onEventResize: withDragAndDropProps["onEventResize"] = async (data) => {
    const id = (data.event as any).id;
    const start = new Date(data.start);
    const end = new Date(data.end);
    updateTimeblock(id, { start, end });
  };

  const onEventDrop: withDragAndDropProps["onEventDrop"] = (data) => {
    const id = (data.event as any).id;
    const start = new Date(data.start);
    const end = new Date(data.end);

    updateTimeblock(id, { start, end });
  };

  const handleCreateTask = useCallback(
    async ({
      start,
      end,
      title,
    }: {
      title?: string;
      start: Date;
      end: Date;
    }) => {
      await trpc.timeblock.createTimeblock.mutate({
        start,
        end,
        title,
      });

      await doFetch();
    },
    [doFetch]
  );

  const handleSelectEvent = useCallback((event: Event) => {}, []);

  const eventPropGetter = useCallback(
    (event: any) => ({
      ...(event.isDraggable
        ? { className: "isDraggable" }
        : { className: "nonDraggable" }),
    }),
    []
  );

  const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent]);

  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }: DragFromOutsideItemArgs) => {
      if (!draggedEvent) return;

      const { title, time } = draggedEvent;
      console.log(draggedEvent);
      const event = {
        title,
        start: new Date(start),
        end: dayjs(start)
          .add(time ?? 10, "minute")
          .toDate(),
      };
      setDraggedEvent(null);

      handleCreateTask(event);
    },
    [draggedEvent, handleCreateTask]
  );

  const handleDragStart = useCallback((event) => setDraggedEvent(event), []);

  return (
    <div className="flex flex-row gap-4">
      <div className="bg-gray-950 w-[700px] p-8 pl-5 pt-2 rounded-2xl overflow-hidden">
        <DnDCalendar
          defaultView="day"
          events={serverEvents.value}
          localizer={localizer}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
          style={{ height: "100vh" }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleCreateTask}
          selectable
          eventPropGetter={eventPropGetter}
          onDropFromOutside={onDropFromOutside}
          dragFromOutsideItem={dragFromOutsideItem}
          step={10}
          timeslots={12}
          components={{
            event: TimeEvent,
            toolbar: () => <></>,
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="bg-gray-950 p-8 rounded-2xl">
          <p className="text-gray-200 font-semibold text-xl">Routine</p>
        </div>

        <div className="bg-gray-950 flex flex-1 flex-col gap-4 rounded-2xl p-8">
          <p className="text-gray-200 font-semibold text-xl">Featured Tasks</p>
          {[
            {
              title: "헬스장 가기",
              time: 60,
            },
            {
              title: "영어 공부 하기",
              time: 30,
            },
          ].map((item) => (
            <div
              className="bg-[#1a1a1a] border-2 border-gray-00 rounded-2xl p-5"
              draggable="true"
              key={item.title}
              onDragStart={() => {
                handleDragStart(item);
              }}
            >
              {item.title} ({item.time})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const DnDCalendar = withDragAndDrop(Calendar);

export default TimeBlocking;
