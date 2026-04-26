import { useState, useEffect } from "react";
import imagemPerfil from "../../assets/noprofil.jpg";
import api from "../../utils/api";
import useFlashMessage from "../../hooks/useFlashMessage";

// Estilos
import styles from "./Perfil.module.css";
import stylesForm from "../../components/layouts/Form.module.css";

// Icones
import { IoMailSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";

const Perfil = () => {
  const [usuario, setUsuario] = useState({});
  const [preview, setPreview] = useState();
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get("/usuarios/checarusuario", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setUsuario(response.data);
      });
  }, [token]);

  function handleChange(e) {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  }

  function onFileChange(e) {
    setPreview(e.target.files[0]);
    setUsuario({ ...usuario, [e.target.name]: e.target.files[0] });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let msgType = "sucesso";

    const formData = new FormData();
    await Object.keys(usuario).forEach((key) => {
      formData.append(key, usuario[key]);
    });

    const data = await api
      .patch(`/usuarios/editar/${usuario.id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        msgType = "erro";
        return error.response.data;
      });

    setFlashMessage(data.message, msgType);
  }

  return (
    <div className={stylesForm.form_container}>
      <div className={styles.wrapper}>
        <div className={styles.form_box}>
          <h1>Perfil</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.upload}>
              {(usuario.imagem || preview) ? (
                <img
                  src={
                    preview
                      ? URL.createObjectURL(preview)
                      : `http://localhost:5000/imagens/usuarios/${usuario.imagem}`
                  }
                  alt={usuario.imagem}
                />
              ) : (<img src={imagemPerfil} alt="imagem de perfil"/>)}
              <div className={styles.round}>
                <input
                  type="file"
                  text="Imagem"
                  name="imagem"
                  placeholder=""
                  onChange={onFileChange}
                />
                <FaCamera />
              </div>
            </div>
            <div className={styles.input_inbox}>
              <span className={styles.icon}>
                <FaUser />
              </span>
              <input
                type="text"
                text="Nome"
                name="nome"
                placeholder=""
                onChange={handleChange}
                value={usuario.nome || ""}
              />
              <label htmlFor="nome">Nome</label>
            </div>
            <div className={styles.input_inbox}>
              <span className={styles.icon}>
                <IoMailSharp />
              </span>
              <input
                type="email"
                text="E-mail"
                name="email"
                placeholder=""
                onChange={handleChange}
                value={usuario.email || ""}
              />
              <label htmlFor="email">E-mail</label>
            </div>
            <div className={styles.input_inbox}>
              <span className={styles.icon}>
                <FaPhone />
              </span>
              <input
                type="text"
                text="Telefone"
                name="telefone"
                placeholder=""
                onChange={handleChange}
                value={usuario.telefone || ""}
              />
              <label htmlFor="telefone">Telefone</label>
            </div>
            <div className={styles.input_inbox}>
              <span className={styles.icon}>
                <RiLockPasswordFill />
              </span>
              <input
                type="password"
                text="senha"
                name="senha"
                placeholder=""
                onChange={handleChange}
              />
              <label htmlFor="senha">Nova senha</label>
            </div>
            <div className={styles.input_inbox}>
              <span className={styles.icon}>
                <FaCheckCircle />
              </span>
              <input
                type="password"
                text="confirmacaosenha"
                name="confirmacaosenha"
                placeholder=""
                onChange={handleChange}
              />
              <label htmlFor="confirmacaosenha">Confirmar Senha</label>
            </div>
            <button type="submit" className={styles.btn}>
              Editar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
