const router = require("express").Router();
const JogosController = require("../controllers/JogosController");

// Helpers
const checarToken = require("../helpers/verificar-token");
const { imageUpload } = require("../helpers/upload-imagens");

router.post(
  "/cadastrar",
  checarToken,
  imageUpload.array("imagens", 5),
  JogosController.cadastrarJogo
);
router.get("/", JogosController.resgatarTodos);
router.get("/meusjogos", checarToken, JogosController.resgatarJogosDoUsuario);
router.get("/:id", JogosController.resgatarJogoPeloId);
router.delete("/:id", checarToken, JogosController.deletarJogoPeloId);
router.patch(
  "/editar/:id",
  checarToken,
  imageUpload.array("imagens", 5),
  JogosController.editarJogo
);

module.exports = router;
