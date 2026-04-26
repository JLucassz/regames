const Jogo = require("../models/Jogo");
const fs = require("fs");

// Helpers
const resgatarToken = require("../helpers/resgatar-token");
const resgatarUsuarioPeloToken = require("../helpers/resgatar-usuario-token");

module.exports = class JogosController {
  static async cadastrarJogo(req, res) {
    const { nome, genero, lancamento, horas, descricao, review, avaliacao } =
      req.body;

    const imagens = req.files ? req.files : [];

    // Validações
    if (!nome) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    if (!genero) {
      res.status(422).json({ message: "O gênero é obrigatório!" });
      return;
    }

    if (!lancamento) {
      res.status(422).json({ message: "A data de lançamento é obrigatória!" });
      return;
    }

    if (imagens.length === 0) {
      res.status(422).json({ message: "Imagens são obrigatórias!" });
      return;
    }

    if (!horas) {
      res
        .status(422)
        .json({ message: "O total de horas jogadas são obrigatórias!" });
      return;
    }

    if (!avaliacao) {
      res.status(422).json({ message: "A avaliação é obrigatória!" });
      return;
    }

    if (!descricao) {
      res.status(422).json({ message: "A descrição é obrigatória!" });
      return;
    }

    if (!review) {
      res.status(422).json({ message: "A review do jogo é obrigatório!" });
      return;
    }

    // Resgatando Usuario que cadastrou o jogo
    const token = resgatarToken(req);
    const usuario = await resgatarUsuarioPeloToken(token);

    // Cadastrando o Jogo
    const jogo = {
      nome,
      genero,
      lancamento,
      imagens: [],
      horas,
      descricao,
      review,
      avaliacao,
      UsuarioId: usuario.id,
    };

    // Upload de Imagens
    imagens.map((imagem) => {
      jogo.imagens.push(imagem.filename);
    });

    try {
      const novoJogo = await Jogo.create(jogo);
      res
        .status(201)
        .json({ message: "Jogo cadastrado com sucesso!", novoJogo });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async resgatarTodos(req, res) {
    // Resgatando todos os jogos em ordem de criação
    const jogos = await Jogo.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ jogos: jogos });
  }

  static async resgatarJogosDoUsuario(req, res) {
    // Resgatar usuario pelo token
    const token = resgatarToken(req);
    const usuario = await resgatarUsuarioPeloToken(token);

    const jogos = await Jogo.findAll({
      where: { UsuarioId: usuario.id },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ jogos });
  }

  static async resgatarJogoPeloId(req, res) {
    const id = req.params.id;

    const jogo = await Jogo.findOne({ where: { id: id } });

    if (!jogo) {
      res.status(404).json({ message: "Jogo não encontrado!" });
      return;
    }

    res.status(200).json({ jogo: jogo });
  }

  static async deletarJogoPeloId(req, res) {
    const id = req.params.id;

    // Checando se o jogo existe
    const jogo = await Jogo.findOne({ where: { id: id } });

    if (!jogo) {
      res.status(404).json({ message: "Jogo não encontrado!" });
      return;
    }

    // Checando se o usuário logado cadastrou o jogo
    const token = resgatarToken(req);
    const usuario = await resgatarUsuarioPeloToken(token);

    if (jogo.UsuarioId !== usuario.id) {
      res.status(422).json({
        message:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    // Converter array de imagens (string) do banco para array real
    let imagens = jogo.imagens;
    if (typeof imagens === "string") {
      imagens = JSON.parse(imagens);
    }

    // Verificar se há imagens e excluir da pasta public
    if (Array.isArray(imagens)) {
      imagens.forEach((imagem) => {
        fs.unlinkSync(`./public/imagens/jogos/${imagem}`);
      });
    }

    await Jogo.destroy({ where: { id: id } });
    res.status(200).json({ message: "Jogo excluido com sucesso!" });
  }

  static async editarJogo(req, res) {
    const id = req.params.id;

    const { nome, genero, lancamento, horas, descricao, review, avaliacao } =
      req.body;

    const jogoAtualizado = {};

    // Checando se o jogo existe
    const jogo = await Jogo.findOne({ where: { id: id } });

    if (!jogo) {
      res.status(404).json({ message: "Jogo não encontrado!" });
      req.files.forEach((imagem) => {
        fs.unlinkSync(`./public/imagens/jogos/${imagem.filename}`);
      });
      return;
    }

    const imagensAntigas = JSON.parse(jogo.imagens); // convertendo em array real (No banco esta em string)
    const imagensNovas = req.files;

    // Checando se o usuário logado cadastrou o jogo
    const token = resgatarToken(req);
    const usuario = await resgatarUsuarioPeloToken(token);

    if (jogo.UsuarioId !== usuario.id) {
      res.status(422).json({
        message:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
      req.files.forEach((imagem) => {
        fs.unlinkSync(`./public/imagens/jogos/${imagem.filename}`);
      });
      return;
    }

    // Validações
    if (!nome) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      req.files.forEach((imagem) => {
        fs.unlinkSync(`./public/imagens/jogos/${imagem.filename}`);
      });
      return;
    } else {
      jogoAtualizado.nome = nome;
    }

    if (!genero) {
      res.status(422).json({ message: "O gênero é obrigatório!" });
      req.files.forEach((imagem) => {
        fs.unlinkSync(`./public/imagens/jogos/${imagem.filename}`);
      });
      return;
    } else {
      jogoAtualizado.genero = genero;
    }

    if (!lancamento) {
      res.status(422).json({ message: "A data de lançamento é obrigatória!" });
      req.files.forEach((imagem) => {
        fs.unlinkSync(`./public/imagens/jogos/${imagem.filename}`);
      });
      return;
    } else {
      jogoAtualizado.lancamento = lancamento;
    }

    if (
      (!req.files || imagensNovas.length === 0) &&
      imagensAntigas.length === 0
    ) {
      res
        .status(422)
        .json({ message: "O jogo precisa ter pelo menos uma imagem!" });
      return;
    }

    if (!horas) {
      res
        .status(422)
        .json({ message: "O total de horas jogadas são obrigatórias!" });
      req.files.forEach((imagem) => {
        fs.unlinkSync(`./public/imagens/jogos/${imagem.filename}`);
      });
      return;
    } else {
      jogoAtualizado.horas = horas;
    }

    if (!descricao) {
      res.status(422).json({ message: "A descrição é obrigatória!" });
      req.files.forEach((imagem) => {
        fs.unlinkSync(`./public/imagens/jogos/${imagem.filename}`);
      });
      return;
    } else {
      jogoAtualizado.descricao = descricao;
    }

    if (!review) {
      res.status(422).json({ message: "A review do jogo é obrigatória!" });
      req.files.forEach((imagem) => {
        fs.unlinkSync(`./public/imagens/jogos/${imagem.filename}`);
      });
      return;
    } else {
      jogoAtualizado.review = review;
    }

    if (!avaliacao) {
      res.status(422).json({ message: "A avaliação é obrigatória!" });
      req.files.forEach((imagem) => {
        fs.unlinkSync(`./public/imagens/jogos/${imagem.filename}`);
      });
      return;
    } else {
      jogoAtualizado.avaliacao = avaliacao;
    }

    // Adicionando novas imagens no banco
    if (imagensNovas.length > 0) {
      jogoAtualizado.imagens = [];
      imagensNovas.map((imagem) => {
        jogoAtualizado.imagens.push(imagem.filename);
      });
    }

    const nomesImagensNovas = imagensNovas.map((img) => img.filename);

    // Remover imagens antigas que não estão entre as novas (ou manter todas se nenhuma nova for enviada)
    if (imagensNovas.length > 0) {
      imagensAntigas.forEach((imagem) => {
        if (!nomesImagensNovas.includes(imagem)) {
          fs.unlinkSync(`./public/imagens/jogos/${imagem}`);
        }
      });
    }

    try {
      await Jogo.update(jogoAtualizado, { where: { id: id } });
      res.status(200).json({ message: "Jogo atualizado com sucesso!" });
      console.log(jogoAtualizado);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
