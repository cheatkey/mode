import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { timeblockService } from "../service/Timeblock.service";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  timeblock: {
    updateTimeblock: t.procedure
      .input(
        z.object({
          id: z.number(),
          data: z.object({
            title: z.optional(z.string()),
            start: z.optional(z.date()),
            end: z.optional(z.date()),
            taskID: z.optional(z.number()),
          }),
        })
      )
      .mutation(async (req) => {
        return timeblockService.updateTimeBlock(req.input);
      }),
    createTimeblock: t.procedure
      .input(
        z.object({
          title: z.optional(z.string()),
          start: z.date(),
          end: z.date(),
          taskID: z.optional(z.number()),
        })
      )
      .mutation(async (req) => {
        return timeblockService.createTimeBlock(req.input);
      }),
    getDailyTimeblocks: t.procedure
      .input(
        z.object({
          date: z.string(),
        })
      )
      .query(async (req) => {
        return timeblockService.findDailyTimeBlock({ date: req.input.date });
      }),
  },
});

export type AppRouter = typeof appRouter;

interface User {
  id: string;
  name: string;
  email: string;
}

const userList: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe@gmail.com",
  },
  {
    id: "2",
    name: "Abraham Smith",
    email: "abrahamsmith@gmail.com",
  },
  {
    id: "3",
    name: "Barbie Tracy",
    email: "barbietracy@gmail.com",
  },
  {
    id: "4",
    name: "John Payday",
    email: "johnpayday@gmail.com",
  },
  {
    id: "5",
    name: "Remember My Name",
    email: "remembermyname@gmail.com",
  },
  {
    id: "6",
    name: "Go to School",
    email: "gotoschool@gmail.com",
  },
  {
    id: "7",
    name: "Fish Fruit",
    email: "fishfruit@gmail.com",
  },
  {
    id: "8",
    name: "Don't try",
    email: "donttry@gmail.com",
  },
  {
    id: "9",
    name: "Producer Feed",
    email: "producerfeed@gmail.com",
  },
  {
    id: "10",
    name: "Panic So",
    email: "panicso@gmail.com",
  },
];
