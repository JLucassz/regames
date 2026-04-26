const jwt = require("jsonwebtoken");
const resgatarToken = require("./resgatar-token");

// Validação do Token
const checarToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  const token = resgatarToken(req);

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const verificado = jwt.verify(token, "secret");
    req.usuario = verificado;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Token Inválido!" });
  }
};

module.exports = checarToken;
