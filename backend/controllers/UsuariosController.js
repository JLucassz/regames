const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// Helpers
const criarToken = require("../helpers/criar-token");
const resgatarToken = require("../helpers/resgatar-token");
const resgatarUsuarioPeloToken = require("../helpers/resgatar-usuario-token");

module.exports = class UsuariosController {
  static async registro(req, res) {
    const { nome, email, senha, confirmacaosenha, telefone } = req.body;

    // Validações
    if (!nome) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      return;
    }

    if (!senha) {
      res.status(422).json({ message: "A senha é obrigatória!" });
      return;
    }

    if (!confirmacaosenha) {
      res
        .status(422)
        .json({ message: "A confirmação da senha é obrigatória!" });
      return;
    }

    if (senha !== confirmacaosenha) {
      res.status(422).json({
        message: "A senha e a confirmação de senha precisam ser iguais!",
      });
      return;
    }

    if (!telefone) {
      res.status(422).json({ message: "O telefone é obrigatório!" });
      return;
    }

    // Validação para checar se usuário ja existe
    const existeUsuario = await Usuario.findOne({ where: { email: email } });

    if (existeUsuario) {
      res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
      return;
    }

    // Criando senha Encriptada
    const salt = bcrypt.genSaltSync(12);
    const senhaHash = bcrypt.hashSync(senha, salt);

    // Cadastrando usuario
    const usuario = {
      nome,
      email,
      senha: senhaHash,
      telefone,
    };

    try {
      const novoUsuario = await Usuario.create(usuario);
      await criarToken(novoUsuario, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    const { email, senha } = req.body;

    // Validações
    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      return;
    }

    if (!senha) {
      res.status(422).json({ message: "A senha é obrigatória!" });
      return;
    }

    // Verificando se usuário existe
    const usuario = await Usuario.findOne({ where: { email: email } });

    if (!usuario) {
      res
        .status(422)
        .json({ message: "Não existe usuário cadastrado com esse e-mail!" });
      return;
    }

    // Checar se a senha combina com a do banco
    const checarSenha = bcrypt.compareSync(senha, usuario.senha);

    if (!checarSenha) {
      res.status(422).json({ message: "Senha inválida!" });
      return;
    }

    await criarToken(usuario, req, res);
  }

  static async checarUsuarioAtual(req, res) {
    let usuarioAtual;

    if (req.headers.authorization) {
      const token = resgatarToken(req);
      const tokenDecodificado = jwt.verify(token, "secret");

      usuarioAtual = await Usuario.findOne({
        where: { id: tokenDecodificado.id },
      });
      usuarioAtual.senha = undefined;
    } else {
      usuarioAtual = null;
    }

    res.status(200).send(usuarioAtual);
  }

  static async resgatarUsuarioPeloId(req, res) {
    const id = req.params.id;

    const usuario = await Usuario.findOne({
      where: { id: id },
      raw: true,
      attributes: { exclude: ["senha"] },
    });

    if (!usuario) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    res.status(200).json({ usuario });
  }

  static async editarUsuario(req, res) {
    const id = req.params.id;

    // Checando se usuario existe
    const token = resgatarToken(req);
    const usuario = await resgatarUsuarioPeloToken(token);

    const imagemAntiga = usuario.imagem;

    const { nome, email, senha, confirmacaosenha, telefone } = req.body;

    const novaImagem = req.file ? req.file.filename : imagemAntiga

    // Validações
    if (!nome) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      if(novaImagem) fs.unlinkSync(`./public/imagens/usuarios/${novaImagem}`)
      return;
    }

    usuario.nome = nome;

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      if(novaImagem) fs.unlinkSync(`./public/imagens/usuarios/${novaImagem}`)
      return;
    }

    // Checando se email ja esta cadastrado
    const usuarioExiste = await Usuario.findOne({ where: { email: email } });

    if (usuario.email !== email && usuarioExiste) {
      res.status(422).json({ message: "Esse e-mail ja esta sendo usado!" });
      if(novaImagem) fs.unlinkSync(`./public/imagens/usuarios/${novaImagem}`)
      return;
    }

    usuario.email = email;

    if (senha != confirmacaosenha) {
      res.status(422).json({ message: "As senhas não conferem!" });
      if(novaImagem) fs.unlinkSync(`./public/imagens/usuarios/${novaImagem}`)
      return;
    } else if (senha === confirmacaosenha && senha != null) {
      // Criando nova senha (Para atualizar)
      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(senha, salt);

      usuario.senha = senhaHash;
    }

    if (!telefone) {
      res.status(422).json({ message: "O telefone é obrigatório!" });
      if(novaImagem) fs.unlinkSync(`./public/imagens/usuarios/${novaImagem}`)
      return;
    }

    usuario.telefone = telefone;

    try {
      // Retornando dados atualizados
      usuario.imagem = novaImagem;
      await Usuario.update(usuario, { where: { id: id } });

      if (imagemAntiga) {
        fs.unlinkSync(`./public/imagens/usuarios/${imagemAntiga}`);
      }

      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
      console.log(usuario);
    } catch (error) {
      res.status(500).json({ message: error });
      return;
    }
  }
};
