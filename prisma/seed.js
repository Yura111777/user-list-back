const { PrismaClient } = require("@prisma/client");

const { randEmail, randFullName, randJobTitle } = require("@ngneat/falso");

const prisma = new PrismaClient();
async function main() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  for (let index = 0; index < 20; index++) {
    const user = await prisma.user.create({
      data: {
        name: randFullName(),
        email: randEmail(),
        img: "default.png",
      },
    });

    await prisma.positions.create({
      data: {
        userId: user.id,
        position: randJobTitle(),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
