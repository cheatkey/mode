"use client";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
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

interface DraggableMouseEvent extends MouseEvent {
  isDraggable: boolean;
}

interface TimeBlockingProps {}

const formatName = (name, count) => `${name} ID ${count}`;

const TimeBlocking = ({}: TimeBlockingProps) => {
  const [draggedEvent, setDraggedEvent] = useState<{
    name: string;
    title: string;
  } | null>(null);
  const [events, setEvents] = useState<
    {
      title: string;
      start: Date;
      end: Date;
      id: string;
    }[]
  >([]);

  const [counters, setCounters] = useState({ item1: 0, item2: 0 });

  const onEventResize: withDragAndDropProps["onEventResize"] = (data) => {
    const id = (data.event as any).id;
    const start = new Date(data.start);
    const end = new Date(data.end);

    setEvents(
      cloneDeep(events).map((current) => {
        if (current.id === id) {
          return {
            ...current,
            start,
            end,
          };
        }
        return current;
      })
    );
  };

  const onEventDrop: withDragAndDropProps["onEventDrop"] = (data) => {
    const id = (data.event as any).id;
    const start = new Date(data.start);
    const end = new Date(data.end);

    setEvents(
      cloneDeep(events).map((current) => {
        if (current.id === id) {
          return {
            ...current,
            start,
            end,
          };
        }
        return current;
      })
    );
  };

  const handleSelectSlot = useCallback(
    ({ start, end }: SlotInfo) => {
      const title = window.prompt("New Event Name");
      if (title) {
        setEvents((prev) => [...prev, { start, end, title, id: nanoid() }]);
      }
    },
    [setEvents]
  );

  const handleSelectEvent = useCallback(
    (event: Event) => window.alert(event.title),
    []
  );

  const eventPropGetter = useCallback(
    (event: any) => ({
      ...(event.isDraggable
        ? { className: "isDraggable" }
        : { className: "nonDraggable" }),
    }),
    []
  );

  const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent]);

  const getNewEvent = useCallback(
    (event: Event) => {
      setEvents((prev) => {
        const idList = prev.map((item) => item.id);
        const newId = Math.max(...idList) + 1;
        return [...prev, { ...event, id: newId }];
      });
    },
    [setEvents]
  );

  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }: DragFromOutsideItemArgs) => {
      if (!draggedEvent) return;

      const { name } = draggedEvent;
      const event = {
        title: formatName(name, (counters as any)[name]),
        start,
        end,
        isAllDay,
      };
      setDraggedEvent(null);
      setCounters((prev) => {
        const { [name]: count } = prev;
        return {
          ...prev,
          [name]: count + 1,
        };
      });
      getNewEvent(event);
    },
    [draggedEvent, counters, setDraggedEvent, setCounters, getNewEvent]
  );

  const handleDragStart = useCallback((event) => setDraggedEvent(event), []);

  const CustomEvent = ({ event }) => {
    return (
      <div className="flex flex-col gap-0">
        <p className="text-gray-100 text-lg font-bold tracking-tight">
          {event.title}
        </p>
        <p className="text-gray-300 text-base">
          {format(event.start, "HH:mm")} ~ {format(event.end, "HH:mm")}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="bg-gray-950 w-[700px] p-8 pl-5 pt-2 rounded-2xl overflow-hidden">
        <DnDCalendar
          defaultView="day"
          events={events}
          localizer={localizer}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
          style={{ height: "100vh" }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventPropGetter}
          onDropFromOutside={onDropFromOutside}
          dragFromOutsideItem={dragFromOutsideItem}
          step={10}
          timeslots={12}
          components={{
            event: CustomEvent,
            toolbar: () => <></>,
          }}
        />
      </div>

      <div className="bg-gray-950 flex-1 rounded-2xl p-8">
        {Object.entries(counters).map(([name, count]) => (
          <div
            draggable="true"
            key={name}
            onDragStart={() => {
              handleDragStart({ title: formatName(name, count), name });
            }}
          >
            {formatName(name, count)}
          </div>
        ))}
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