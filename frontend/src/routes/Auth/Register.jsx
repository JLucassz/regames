import { Link } from "react-router-dom";
import { useState, useContext } from "react";

// Estilos
import stylesForm from "../../components/layouts/Form.module.css";
import styles from "./Register.module.css";

// Icones
import { IoMailSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";

// Contexto
import { Contexto } from "../../context/UsuarioContext";

const Register = () => {
  const [usuario, setUsuario] = useState({});
  const { registro } = useContext(Contexto);

  function handleChange(e) {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    registro(usuario);
  }

  return (
    <div className={stylesForm.form_container}>
      <div className={styles.wrapper}>
        <div className={styles.form_box}>
          <h1>Registro</h1>
          <form onSubmit={handleSubmit}>
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
              <label htmlFor="senha">Senha</label>
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
              Cadastrar
            </button>
            <div className={styles.login_register}>
              <p>
                Já tem uma conta?{" "}
                <Link to="/login" className={styles.register_link}>
                  Clique aqui
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
