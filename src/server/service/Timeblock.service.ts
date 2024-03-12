import { isNil } from "lodash-es";
import { prisma } from "../prisma";
import dayjs from "dayjs";

class TimeblockService {
  createTimeBlock = async (input: {
    title?: string;
    start: Date;
    end: Date;
    taskID?: number;
  }) => {
    const payload: Parameters<typeof prisma.timeBlock.create>[0] = {
      data: {
        start: input.start,
        end: input.end,
        title: input.title ?? "Time Slot",
      },
    };

    if (!isNil(input.taskID))
      payload.data.task = {
        connect: {
          id: input.taskID,
        },
      };

    return prisma.timeBlock.create(payload);
  };

  updateTimeBlock = async (input: {
    id: number;
    data: {
      title?: string;
      start?: Date;
      end?: Date;
      taskID?: number;
    };
  }) => {
    const payload: Parameters<typeof prisma.timeBlock.update>[0] = {
      where: {
        id: input.id,
      },
      data: {},
    };

    if (!isNil(input.data.title)) payload.data.title = input.data.title;
    if (!isNil(input.data.start)) payload.data.start = input.data.start;
    if (!isNil(input.data.end)) payload.data.end = input.data.end;
    if (!isNil(input.data.taskID))
      payload.data.task = {
        connect: {
          id: input.data.taskID,
        },
      };

    return prisma.timeBlock.update(payload);
  };

  findDailyTimeBlock = async (input: { date: string }) => {
    const dayStart = dayjs(input.date).startOf("day").toDate();
    const dayEnd = dayjs(input.date).endOf("day").toDate();

    return prisma.timeBlock.findMany({
      where: {
        start: {
          gte: dayStart,
        },
        end: {
          lte: dayEnd,
        },
      },
      include: {
        task: {
          select: {
            title: true,
          },
        },
      },
    });
  };
}

export const timeblockService = new TimeblockService();
