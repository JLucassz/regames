const multer = require("multer");
const path = require("path");

// Destino para armazenas imagens
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    if (req.baseUrl.includes("usuarios")) {
      folder = "usuarios";
    } else if (req.baseUrl.includes("jogos")) {
      folder = "jogos";
    }

    cb(null, `public/imagens/${folder}`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(
        new Error("Por favor, envie imagens apenas no formato jpg ou png!")
      );
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
