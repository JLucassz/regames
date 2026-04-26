const express = require("express");
const cors = require("cors");

const app = express();

// Conexão ao Banco
const conn = require("./db/conn");

// Models
const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");

// Config resposta JSON
app.use(express.json());

// Cors
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// Pasta public
app.use(express.static("public"));

// Rotas
const JogosRoutes = require("./routes/JogosRoutes")
const UsuariosRoutes = require("./routes/UsuariosRoutes")

app.use("/usuarios", UsuariosRoutes)
app.use("/jogos", JogosRoutes)

// Sincronizando BD e chamando aplicação
conn
  .sync()
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
