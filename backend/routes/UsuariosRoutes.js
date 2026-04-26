const router = require("express").Router();
const UsuariosController = require("../controllers/UsuariosController");

// Proteção para rotas
const checarToken = require("../helpers/verificar-token");

// Helper de Imagem
const { imageUpload } = require("../helpers/upload-imagens");

router.post("/registro", UsuariosController.registro);
router.post("/login", UsuariosController.login);
router.get("/checarusuario", UsuariosController.checarUsuarioAtual);
router.get("/:id", UsuariosController.resgatarUsuarioPeloId);
router.patch(
  "/editar/:id",
  checarToken,
  imageUpload.single("imagem"),
  UsuariosController.editarUsuario
);

module.exports = router;
