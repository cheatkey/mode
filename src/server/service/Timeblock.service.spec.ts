import { prisma } from "../prisma";
import { timeblockService } from "./Timeblock.service";

describe("timeblockService testing", () => {
  it("task 없이 타임 블록을 생성할 수 있다", async () => {
    await timeblockService.createTimeBlock({
      start: new Date(),
      end: new Date(),
    });
    expect(await prisma.timeBlock.count()).toEqual(1);
  });

  it("타임 블록을 생성할 시 작업을 지정할 수 있다.", async () => {
    const task = await prisma.task.create({
      data: {
        title: "test",
        content: "test",
        status: "test",
        point: 1,
      },
    });
    const startDate = new Date();
    await timeblockService.createTimeBlock({
      start: startDate,
      end: new Date(),
      taskID: task.id,
    });
    const createdTimeblock = await prisma.timeBlock.findFirst({
      include: {
        task: true,
      },
    });
    expect(createdTimeblock?.start).toEqual(startDate);
    expect(createdTimeblock?.task?.id).toEqual(task.id);
  });
});
