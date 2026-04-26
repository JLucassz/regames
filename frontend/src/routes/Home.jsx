import api from "../utils/api";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

import styles from "./Home.module.css";
import stylesContainer from "../components/layouts/Container.module.css";

const Home = () => {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    api.get("/jogos/").then((response) => {
      setJogos(response.data.jogos);
    });
  }, []);

  const renderizarEstrelas = (avaliacao) => {
    const estrelas = [];
    const avaliacaoEstrelas = avaliacao / 2;

    for (let i = 1; i <= 5; i++) {
      if (avaliacaoEstrelas >= i) {
        estrelas.push(<FaStar key={i} color="#facc15" />);
      } else if (avaliacaoEstrelas >= i - 0.5) {
        estrelas.push(<FaStarHalfAlt key={i} color="#facc15" />);
      } else {
        estrelas.push(<FaRegStar key={i} color="#facc15" />);
      }
    }

    return estrelas;
  };

  return (
    <section className={stylesContainer.container}>
      <div className={styles.wrapper}>
        {/* Header dentro do wrapper, na parte superior */}
        <div className={styles.header}>
          <p>Bem-vindo ao</p>
          <h1>
            <span>ReGames</span>
          </h1>
          <p>Aqui você verá um breve review dos jogos mais populares!</p>
          <div className={styles.search_container}>
            <input type="text" placeholder="Pesquisar jogos..." />
            <i className={styles.icone}>
              <FaSearch />
            </i>
          </div>
        </div>

        {/* Container dos jogos abaixo */}
        <div className={styles.jogosContainer}>
          {jogos.length > 0 ? (
            jogos.map((jogo) => {
              const jogoImagens = JSON.parse(jogo.imagens);

              return (
                <div
                  key={jogo.id}
                  className={`${styles.jogoCard} ${styles.rgb}`}
                >
                  <div className={styles.card_image}>
                    <img
                      src={`http://localhost:5000/imagens/jogos/${jogoImagens[0]}`}
                      alt={jogo.nome}
                    />
                  </div>
                  <div className={styles.card_text}>
                    <h3>{jogo.nome}</h3>
                    <div className={styles.rating_display}>
                      {renderizarEstrelas(jogo.avaliacao)}
                    </div>
                  </div>
                  <div className={styles.card_button}>
                    <Link  className={styles.btn} to={`jogos/${jogo.id}`}>Mais Detalhes</Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Não há jogos cadastrados!</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
