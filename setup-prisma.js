jest.mock("./src/server/prisma", () => {
  return {
    prisma: jestPrisma.client,
  };
});
