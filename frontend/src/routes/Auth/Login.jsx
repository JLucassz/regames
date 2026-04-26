import { Link } from "react-router-dom";
import { useState, useContext } from "react";

// Estilos
import stylesForm from "../../components/layouts/Form.module.css";
import styles from "./Login.module.css";

// Icones
import { IoMailSharp } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";

// Contexto
import { Contexto } from "../../context/UsuarioContext";

const Login = () => {
  function handleChange(e) {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    login(usuario);
  }

  const [usuario, setUsuario] = useState({});
  const { login } = useContext(Contexto);

  return (
    <div className={stylesForm.form_container}>
      <div className={styles.wrapper}>
        <div className={styles.form_box}>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
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
            <button type="submit" className={styles.btn}>
              Entrar
            </button>
            <div className={styles.login_register}>
              <p>
                Não possui uma conta?{" "}
                <Link to="/registro" className={styles.register_link}>
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

export default Login;
