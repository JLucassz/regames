const { DataTypes } = require("sequelize");

const db = require("../db/conn");

// Model de Usuario
const Usuario = require("./Usuario");

const Jogo = db.define("Jogo", {
  nome: {
    type: DataTypes.STRING,
    require: true,
  },
  genero: {
    type: DataTypes.STRING,
    require: true,
  },
  lancamento: {
    type: DataTypes.INTEGER,
    require: true,
  },
  imagens: {
    type: DataTypes.JSON,
    require: true
  },
  horas: {
    type: DataTypes.INTEGER,
    require: true
  },
  descricao: {
    type: DataTypes.STRING,
    require: true,
  },
  review: {
    type: DataTypes.STRING,
    require: true,
  },
  avaliacao: {
    type: DataTypes.DECIMAL,
    require: true,
  },
});

Jogo.belongsTo(Usuario);
Usuario.hasMany(Jogo);

module.exports = Jogo;
