const { PrismaClient } = require("@prisma/client");
const catchAsync = require("../utils/catchAsync");

exports.getPositions = catchAsync(async (req, res, next) => {
  const prisma = new PrismaClient();

    const positions = await prisma.positions.findMany();
    res.status(201).json(positions);
  
});

