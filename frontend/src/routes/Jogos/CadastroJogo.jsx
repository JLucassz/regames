import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextAreaAutoSize from "react-textarea-autosize";
import { FaUpload, FaTrash } from "react-icons/fa";

// API
import api from "../../utils/api";

// Estilos
import styles from "./CadastroJogo.module.css";
import stylesForm from "../../components/layouts/Form.module.css";

// Hooks
import useFlashMessage from "../../hooks/useFlashMessage";

const CadastroJogo = () => {
  const [jogo, setJogo] = useState({});
  const [arquivos, setArquivos] = useState([]);
  const [avaliacao, setAvaliacao] = useState(0);
  const { setFlashMessage } = useFlashMessage();
  const [token] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

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
    console.log(jogo);

    let msgType = "sucesso";

    const formData = new FormData
    
    await Object.keys(jogo).forEach((key) => {
      if(key === "imagens") {
        for(let i = 0; i < jogo[key].length; i++) {
          formData.append("imagens", jogo[key][i])
        }
      } else {
        formData.append(key, jogo[key])
      }
    })

    const data = await api
      .post("jogos/cadastrar", formData, {
        Authorization: `Bearer ${JSON.parse(token)}`,
        "Content-Type": "multipart/form-data"
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "erro";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
    if (msgType !== "erro") {
      navigate("/");
    }
  }

  return (
    <div className={stylesForm.form_container}>
      <div className={styles.wrapper}>
        <div className={styles.form_box}>
          <h1>Adicione um novo Jogo</h1>
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
                  />
                  <label htmlFor="nome">Nome</label>
                </div>

                <div className={styles.input_inbox}>
                  <input
                    type="date"
                    name="lancamento"
                    placeholder=""
                    onChange={handleChange}
                  />
                  <label htmlFor="lancamento">Data de Lançamento</label>
                </div>

                <div className={styles.input_inbox}>
                  <input
                    type="number"
                    name="horas"
                    placeholder=""
                    onChange={handleChange}
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
                  />
                  <label htmlFor="genero">Gênero</label>
                </div>

                {/* Input de imagens */}
                <div className={styles.input_inbox_file}>
                  <input
                    type="file"
                    name="imagens"
                    id="imagens"
                    multiple
                    onChange={handleArquivos}
                  />

                  {/* Se houver arquivos, exibe a lista dentro da label */}
                  {arquivos.length === 0 ? (
                    <label htmlFor="imagens">
                      <i>
                        <FaUpload />
                      </i>
                      <span>Adicionar imagens</span>
                    </label>
                  ) : (
                    <div className={styles.fileListContainer}>
                      <ul>
                        {arquivos.map((arquivo, index) => (
                          <li key={index}>{arquivo.name}</li>
                        ))}
                      </ul>
                      <button
                        onClick={handleLimparArquivos}
                        className={styles.clearButton}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                {/* Ïnput de Avaliação */}
                <div className={styles.rating_container}>
                  <label className={styles.rating_label} htmlFor="avaliacao">
                    Avaliação{`: ${avaliacao}`}
                  </label>
                  <div className={styles.rating}>
                    <input
                      type="radio"
                      name="avaliacao"
                      value="10"
                      onChange={handleAvaliacao}
                    />
                    <input
                      type="radio"
                      name="avaliacao"
                      value="9"
                      onChange={handleAvaliacao}
                    />
                    <input
                      type="radio"
                      name="avaliacao"
                      value="8"
                      onChange={handleAvaliacao}
                    />
                    <input
                      type="radio"
                      name="avaliacao"
                      value="7"
                      onChange={handleAvaliacao}
                    />
                    <input
                      type="radio"
                      name="avaliacao"
                      value="6"
                      onChange={handleAvaliacao}
                    />
                    <input
                      type="radio"
                      name="avaliacao"
                      value="5"
                      onChange={handleAvaliacao}
                    />
                    <input
                      type="radio"
                      name="avaliacao"
                      value="4"
                      onChange={handleAvaliacao}
                    />
                    <input
                      type="radio"
                      name="avaliacao"
                      value="3"
                      onChange={handleAvaliacao}
                    />
                    <input
                      type="radio"
                      name="avaliacao"
                      value="2"
                      onChange={handleAvaliacao}
                    />
                    <input
                      type="radio"
                      name="avaliacao"
                      value="1"
                      onChange={handleAvaliacao}
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
                  />
                  <label htmlFor="review">
                    Review - Fale o que achou do jogo.
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" className={styles.btn}>
              Adicionar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroJogo;
