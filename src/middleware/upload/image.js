import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = function (req, file, cb) {
  const extension = path.extname(file.originalname);
  const fileSize = parseInt(req.headers["content-length"]);
  const maxSize = 1500000;
  const whitelistExt = [".jpeg", ".png", ".gif", ".jpg", ".webp"];
  const whitelistMimeType = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/webp",
  ];
  if (
    !whitelistMimeType.includes(file.mimetype) &&
    !whitelistExt.includes(extension)
  ) {
    req.uploadError = "only image types are allowed!";
    return cb(null, false);
  }
  if (fileSize > maxSize) {
    req.uploadError = "Max size upload is 1.5Mb";
  }
  cb(null, true);
};

export function uploadError(req, res, next) {
  if (req.uploadError) {
    res.status(403).json({ error: req.uploadError });
    return;
  } else {
    next();
  }
}

export async function storeImage(req, res, next) {
  try {
    const storedFile = await File.create({
      ...req.file,
      path: req.file.path.replace("public/", ""),
      created_by: 1,
    });
    req.file = storedFile;
    next();
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
}

const uploadImage = multer({
  storage,
  fileFilter,
});

export default uploadImage;
