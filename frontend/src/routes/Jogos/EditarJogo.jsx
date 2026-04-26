import api from "../../utils/api";
import { useState, useEffect } from "react";
import styles from "./EditarJogo.module.css";
import stylesForm from "../../components/layouts/Form.module.css";
import useFlashMessage from "../../hooks/useFlashMessage";
import { useParams } from "react-router-dom";
import TextAreaAutoSize from "react-textarea-autosize";
import { FaUpload, FaTrash } from "react-icons/fa";

const EditarJogo = () => {
  const [jogo, setJogo] = useState({});
  const [arquivos, setArquivos] = useState([]);
  const [avaliacao, setAvaliacao] = useState(0);
  const [token] = useState(localStorage.getItem("token") || "");
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get(`/jogos/${id}`, {
        Authorization: `Bearer ${JSON.parse(token)}`,
      })
      .then((response) => {
        const jogoData = response.data.jogo;

        // Ajustar data para o formato aceito pelo input type="date"
        if (jogoData.lancamento) {
          jogoData.lancamento = new Date(jogoData.lancamento)
            .toISOString()
            .split("T")[0];
        }

        // Corrigir imagens salvas como string tipo: '["img1.jpg","img2.jpg"]'
        if (
          jogoData.imagens &&
          typeof jogoData.imagens === "string" &&
          jogoData.imagens.startsWith("[")
        ) {
          try {
            const nomes = JSON.parse(jogoData.imagens);
            jogoData.imagens = nomes.map(
              (nome) => `http://localhost:5000/imagens/jogos/${nome}`
            );
          } catch (error) {
            jogoData.imagens = [];
          }
        }

        setJogo(jogoData);
        setAvaliacao(jogoData.avaliacao || 0); // para sincronizar as estrelas
      });
  }, [token, id]);

  // Funçoes Input Imagens
  const handleArquivos = (e) => {
    const arquivosCarregados = Array.from(e.target.files);
    setArquivos(arquivosCarregados);
    setJogo({ ...jogo, imagens: arquivosCarregados });
  };

  const handleLimparArquivos = () => {
    setArquivos([]);
  };

  // Funçoes Input de Avaliação
  const handleAvaliacao = (e) => {
    const avaliacaoAtual = e.target.value;
    setAvaliacao(avaliacaoAtual);
    setJogo({ ...jogo, avaliacao: avaliacaoAtual });
  };

  // Funçao para todos os outros inputs
  const handleChange = (e) => {
    setJogo({ ...jogo, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    let msgType = "sucesso";

    const formData = new FormData();

    await Object.keys(jogo).forEach((key) => {
      if (key !== "imagens") {
        formData.append(key, jogo[key]);
      }
    });

    // Apenas adiciona arquivos novos, não URLs
    arquivos.forEach((arquivo) => {
      formData.append("imagens", arquivo);
    });

    const data = await api
      .patch(`/jogos/editar/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "erro";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
    console.log(jogo.imagens)
  }

  return (
    <div className={stylesForm.form_container}>
      <div className={styles.wrapper}>
        <div className={styles.form_box}>
          {jogo.nome && (
            <>
              <h1>Editando o jogo: {jogo.nome}</h1>
              <form onSubmit={handleSubmit}>
                <div className={styles.form_columns}>
                  {/* Coluna da esquerda */}
                  <div className={styles.column}>
                    <div className={styles.input_inbox}>
                      <input
                        type="text"
                        name="nome"
                        placeholder=""
                        onChange={handleChange}
                        value={jogo.nome || ""}
                      />
                      <label htmlFor="nome">Nome</label>
                    </div>

                    <div className={styles.input_inbox}>
                      <input
                        type="date"
                        name="lancamento"
                        placeholder=""
                        onChange={handleChange}
                        value={jogo.lancamento || ""}
                      />
                      <label htmlFor="lancamento">Data de Lançamento</label>
                    </div>

                    <div className={styles.input_inbox}>
                      <input
                        type="number"
                        name="horas"
                        placeholder=""
                        onChange={handleChange}
                        value={jogo.horas || ""}
                      />
                      <label htmlFor="horas">Total de horas jogadas</label>
                    </div>

                    <div className={styles.textarea}>
                      <TextAreaAutoSize
                        className={styles.textarea}
                        name="descricao"
                        minRows={2}
                        maxRows={6}
                        placeholder=" "
                        onChange={handleChange}
                        value={jogo.descricao || ""}
                      />
                      <label htmlFor="descricao">
                        Descrição - Fale as caracteristicas do jogo.
                      </label>
                    </div>
                  </div>

                  {/* Coluna da direita */}
                  <div className={styles.column}>
                    <div className={styles.input_inbox}>
                      <input
                        type="text"
                        name="genero"
                        placeholder=""
                        onChange={handleChange}
                        value={jogo.genero || ""}
                      />
                      <label htmlFor="genero">Gênero</label>
                    </div>

                    <div className={styles.input_inbox_file}>
                      {/* Preview de imagens salvas */}
                      {jogo.imagens &&
                        jogo.imagens.length > 0 &&
                        arquivos.length === 0 && (
                          <div className={styles.imagePreviewContainer}>
                            {jogo.imagens.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Imagem ${index}`}
                                className={styles.imagePreview}
                              />
                            ))}

                            <label
                              htmlFor="imagens"
                              className={styles.changeButton}
                            >
                              <i>
                                <FaUpload />
                              </i>
                              <span>Alterar imagens</span>
                            </label>
                          </div>
                        )}

                      {/* Preview de novas imagens carregadas */}
                      {arquivos.length > 0 && (
                        <div className={styles.imagePreviewContainer}>
                          {arquivos.map((arquivo, index) => (
                            <img
                              key={index}
                              src={URL.createObjectURL(arquivo)}
                              alt={`Arquivo ${index}`}
                              className={styles.imagePreview}
                            />
                          ))}
                          <div className={styles.fileButtons}>
                            <label
                              htmlFor="imagens"
                              className={styles.changeButton}
                            >
                              <i>
                                <FaUpload />
                              </i>
                              <span>Alterar imagens</span>
                            </label>
                            <button
                              onClick={handleLimparArquivos}
                              className={styles.clearButton}
                              type="button"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Input escondido */}
                      <input
                        type="file"
                        name="imagens"
                        id="imagens"
                        multiple
                        onChange={handleArquivos}
                        style={{ display: "none" }}
                      />

                      {/* Botão padrão se não tiver nada */}
                      {(!jogo.imagens || jogo.imagens.length === 0) &&
                        arquivos.length === 0 && (
                          <label htmlFor="imagens">
                            <i>
                              <FaUpload />
                            </i>
                            <span>Adicionar imagens</span>
                          </label>
                        )}
                    </div>

                    {/* Ïnput de Avaliação */}
                    <div className={styles.rating_container}>
                      <label
                        className={styles.rating_label}
                        htmlFor="avaliacao"
                      >
                        Avaliação{`: ${avaliacao}`}
                      </label>
                      <div className={styles.rating}>
                        <input
                          type="radio"
                          name="avaliacao"
                          value="10"
                          onChange={handleAvaliacao}
                          checked={avaliacao === "10" || avaliacao === 10}
                        />
                        <input
                          type="radio"
                          name="avaliacao"
                          value="9"
                          onChange={handleAvaliacao}
                          checked={avaliacao === "9" || avaliacao === 9}
                        />
                        <input
                          type="radio"
                          name="avaliacao"
                          value="8"
                          onChange={handleAvaliacao}
                          checked={avaliacao === "8" || avaliacao === 8}
                        />
                        <input
                          type="radio"
                          name="avaliacao"
                          value="7"
                          onChange={handleAvaliacao}
                          checked={avaliacao === "7" || avaliacao === 7}
                        />
                        <input
                          type="radio"
                          name="avaliacao"
                          value="6"
                          onChange={handleAvaliacao}
                          checked={avaliacao === "6" || avaliacao === 6}
                        />
                        <input
                          type="radio"
                          name="avaliacao"
                          value="5"
                          onChange={handleAvaliacao}
                          checked={avaliacao === "5" || avaliacao === 5}
                        />
                        <input
                          type="radio"
                          name="avaliacao"
                          value="4"
                          onChange={handleAvaliacao}
                          checked={avaliacao === "4" || avaliacao === 4}
                        />
                        <input
                          type="radio"
                          name="avaliacao"
                          value="3"
                          onChange={handleAvaliacao}
                          checked={avaliacao === "3" || avaliacao === 3}
                        />
                        <input
                          type="radio"
                          name="avaliacao"
                          value="2"
                          onChange={handleAvaliacao}
                          checked={avaliacao === "2" || avaliacao === 2}
                        />
                        <input
                          type="radio"
                          name="avaliacao"
                          value="1"
                          onChange={handleAvaliacao}
                          checked={avaliacao === "1" || avaliacao === 1}
                        />
                      </div>
                    </div>

                    <div className={styles.textarea}>
                      <TextAreaAutoSize
                        className={styles.textarea}
                        name="review"
                        minRows={2}
                        maxRows={6}
                        placeholder=" "
                        onChange={handleChange}
                        value={jogo.review || ""}
                      />
                      <label htmlFor="review">
                        Review - Fale o que achou do jogo.
                      </label>
                    </div>
                  </div>
                </div>
                <button type="submit" className={styles.btn}>
                  Editar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditarJogo;
