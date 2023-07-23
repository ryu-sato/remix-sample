import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getUsers().map((user) => {
      return db.user.create({ data: user });
    })
  );
}

seed();

function getUsers() {
  return [
    {
      name: "alice",
      taskColor: "#000000",
    },
    {
      name: "bob",
      taskColor: "#880000",
    },
    {
      name: "charlie",
      taskColor: "#008800",
    },
 ];
}