import styles from "./MeusJogos.module.css";
import stylesForm from "../../components/layouts/Form.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFlashMessage from "../../hooks/useFlashMessage";
import api from "../../utils/api";

const MeusJogos = () => {
  const [jogos, setJogos] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get("/jogos/meusjogos", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setJogos(response.data.jogos);
      });
  }, [token]);

  async function removerJogo(id) {
    let msgType = "sucesso";

    const data = await api
      .delete(`/jogos/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        const jogosAtualizados = jogos.filter((jogo) => jogo.id != id);
        setJogos(jogosAtualizados);
        return response.data;
      })
      .catch((err) => {
        msgType = "erro";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
  }

  return (
    <div className={stylesForm.form_container}>
      <div className={styles.wrapper}>
        <div className={styles.jogolist_header}>
          <h1>Jogos Cadastrados</h1>
          <Link to="/jogos/cadastrar">Adicionar novo jogo</Link>
        </div>
        <div className={styles.jogolist_container}>
          {jogos.length > 0 ? (
            jogos.map((jogo) => {
              const jogoImagens = JSON.parse(jogo.imagens);

              return (
                <div key={jogo.id} className={styles.jogolist_row}>
                  <img
                    src={`http://localhost:5000/imagens/jogos/${jogoImagens[0]}`}
                    alt={jogo.nome}
                  />
                  <span>{jogo.nome}</span>
                  <div className={styles.actions}>
                    <Link to={`/jogos/editar/${jogo.id}`}>Editar</Link>
                    <button onClick={() => {
                      removerJogo(jogo.id)
                    }}>Excluir</button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.semjogos}>Não há jogos cadastrados</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeusJogos;
