const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// Resgatando Usuario pelo Token
const resgatarUsuarioPeloToken = async (token) => {
  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  const decoficado = jwt.verify(token, "secret");
  const usuarioId = decoficado.id;

  const usuario = await Usuario.findOne({
    where: { id: usuarioId },
    raw: true,
  });

  return usuario;
};

module.exports = resgatarUsuarioPeloToken;
