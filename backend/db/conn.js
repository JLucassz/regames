const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("regames", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectado com sucesso ao banco!");
} catch (error) {
  console.log(`Houve um problema ao conectar com o BD: ${error}`);
}

module.exports = sequelize
