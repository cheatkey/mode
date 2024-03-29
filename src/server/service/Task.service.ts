import { z } from "zod";
import { googleService } from "./Google.service";
import { prisma } from "../prisma";
import { isNil } from "lodash-es";

const spreadsheetDataSchema = z.array(
  z.object({
    title: z.string(),
    content: z.string(),
    point: z.number(),
  })
);

class TaskService {
  public createTaskFromSpreadSheet = async () => {
    const _sheetData = await googleService.getSpreadSheetJSONData(
      process.env.TASK_CREATE_GOOGLE_SPREADSHEET_ID as string
    );
    const sheetData = spreadsheetDataSchema.parse(_sheetData);

    const data = await prisma.task.createMany({
      data: sheetData.map((v) => ({
        content: v.content,
        point: v.point,
        title: v.title,
        status: "backlog",
      })),
    });
    return data;
  };

  public createTaskFromGoogleDocs = async (tasks: string[]) => {
    return prisma.task.createMany({
      data: tasks.map((title) => ({
        title,
        content: "",
        point: 1,
        status: "backlog",
      })),
    });
  };

  public searchTasks = async (query?: string) => {
    if (isNil(query)) {
      return prisma.task.findMany({});
    }

    return prisma.task.findMany({
      where: {
        title: {
          contains: query,
        },
      },
    });
  };
}

export const taskService = new TaskService();
