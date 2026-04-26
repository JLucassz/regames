const jwt = require("jsonwebtoken");

const criarToken = async (usuario, req, res) => {
  // Criando Token
  const token = jwt.sign(
    {
      name: usuario.nome,
      id: usuario.id,
    },
    "secret"
  );

  // Retornando Token
  res
    .status(200)
    .json({
      message: "Você está autenticado!",
      token: token,
      userId: usuario.id,
    });
};

module.exports = criarToken;
