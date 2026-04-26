import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Logo from "../../assets/logo.jpg";
import styles from "./Navbar.module.css";

// Contexto
import { Contexto } from "../../context/UsuarioContext";

const Navbar = () => {
  const { autenticado, logout } = useContext(Contexto);

  return (
    <nav className={styles.navegacao}>
      <div className={styles.navegacao_logo}>
        <Link to="/">
          <img src={Logo} alt="ReGames" />
        </Link>
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {autenticado ? (
          <>
            <li>
              <Link to="/jogos/meusjogos">Meus Jogos</Link>
            </li>
            <li>
              <Link to="/usuario/perfil">Perfil</Link>
            </li>
            <li>
              <Link onClick={logout}>Sair</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/registro">Registrar</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
