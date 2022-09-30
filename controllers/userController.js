const { PrismaClient } = require("@prisma/client");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("./../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image. Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.createUser = catchAsync(async (req, res, next) => {
  const prisma = new PrismaClient();
  const data = filterObj(req.body, "name", "email");
  const user = await prisma.user.create({
    data,
  });
  if (!req.file) {
    res.status(201).json(user);
  }
  req.user = user;
  if (req.body.position) {
    await prisma.positions.create({
      data: {
        userId: req.user.id,
        position: req.body.position,
      },
    });
    const userUpdated = await prisma.user.findFirst({
      where: { id: req.user.id },
    });
    if (!req.file) {
      res.status(201).json(userUpdated);
    }
  }
  next();
});
exports.uploadUserPhoto = upload.single("photo");
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(75, 75)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`client/public/img/users/${req.file.filename}`);

  next();
});
exports.loadImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const prisma = new PrismaClient();
  const userUpdated = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      img: req.file.filename,
    },
  });
  res.status(201).json(userUpdated);
});
exports.getUsers = catchAsync(async (req, res, next) => {
  const prisma = new PrismaClient();
  if (req.query.id) {
    const users = await prisma.user.findMany({
      take: 6,
      skip: 1, // Skip the cursor
      cursor: {
        id: req.query.id,
      },
      include: {
        positions: true
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    res.status(201).json(users);
  } else {
    const users = await prisma.user.findMany({
      take: 6,
      include: {
        positions: true
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    res.status(201).json(users);
  }
});

exports.getUser = catchAsync(async (req, res, next) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: { id: req.params.id },
  });
  res.status(201).json(user);
});
