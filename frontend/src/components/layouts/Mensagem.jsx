import styles from "./Mensagem.module.css";
import { useState, useEffect } from "react";
import bus from "../../utils/bus";

const Mensagem = () => {
  const [visivel, setVisivel] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    bus.addListener("flash", ({ mensagem, type }) => {
      setVisivel(true);
      setMensagem(mensagem);
      setType(type);

      setTimeout(() => {
        setVisivel(false);
      }, 3000);
    });
  }, []);

  return (
    visivel && (
      <div className={styles.mensagem_container}>
        <div className={`${styles.mensagem} ${styles[type]}`}>{mensagem}</div>
      </div>
    )
  );
};

export default Mensagem;
