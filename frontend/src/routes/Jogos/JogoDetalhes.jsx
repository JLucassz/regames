import api from "../../utils/api";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

import styles from "./JogoDetalhes.module.css";
import stylesContainer from "../../components/layouts/Container.module.css";

const JogoDetalhes = () => {
  const [jogo, setJogo] = useState({});
  const { id } = useParams();

  useEffect(() => {
    api.get(`/jogos/${id}`).then((response) => {
      setJogo(response.data.jogo);
    });
  }, [id]);

  let imagens = [];
  if (typeof jogo.imagens === "string") {
    imagens = JSON.parse(jogo.imagens);
  }

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
    <div className={stylesContainer.container}>
      <section className={styles.wrapper}>
        {jogo.nome && (
          <section>
            <div className={styles.header}>
              <h1>{jogo.nome}</h1>
            </div>

            <div className={styles.slider}>
              {/* {imagens.map((imagem, index) => (
                <img
                  src={`http://localhost:5000/imagens/jogos/${imagem}`}
                  alt={jogo.nome}
                  key={index}
                />
              ))} */}

              <input type="radio" name="slider" id="slider1" checked />
              <input type="radio" name="slider" id="slider2" />
              <input type="radio" name="slider" id="slider3" />
              <input type="radio" name="slider" id="slider4" />
              <div className={styles.slides}>
                <div className={styles.overflow}>
                  <div className={styles.inner}>
                    <div className={`${styles.slide} ${styles.slide_1}`}>
                      <div className={styles.slide_content}>
                        <h2>Slide 1</h2>
                        <p>Conteudo do slide</p>
                      </div>
                    </div>
                    <div className={`${styles.slide} ${styles.slide_2}`}>
                      <div className={styles.slide_content}>
                        <h2>Slide 2</h2>
                        <p>Conteudo do slide</p>
                      </div>
                    </div>
                    <div className={`${styles.slide} ${styles.slide_3}`}>
                      <div className={styles.slide_content}>
                        <h2>Slide 3</h2>
                        <p>Conteudo do slide</p>
                      </div>
                    </div>
                    <div className={`${styles.slide} ${styles.slide_4}`}>
                      <div className={styles.slide_content}>
                        <h2>Slide 4</h2>
                        <p>Conteudo do slide</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.controls}>
                <label htmlFor="slide1"></label>
                <label htmlFor="slide2"></label>
                <label htmlFor="slide3"></label>
                <label htmlFor="slide4"></label>
              </div>
              <div className={styles.bullets}>
                <label htmlFor="slide1"></label>
                <label htmlFor="slide2"></label>
                <label htmlFor="slide3"></label>
                <label htmlFor="slide4"></label>
              </div>
            </div>

            {/* <div>
              <h1>Informações:</h1>
              <p>Gênero: {jogo.genero}</p>
              <p>Data de Lançamento: {jogo.lancamento}</p>
              <p>Total de horas jogadas: {jogo.horas}</p>
              <p>Descrição:</p>
              {jogo.descricao}
            </div>
            <div>
              <h1>Review:</h1>
              <div>{renderizarEstrelas(jogo.avaliacao)}</div>
              {jogo.review}
            </div> */}
          </section>
        )}
      </section>
    </div>
  );
};

export default JogoDetalhes;
