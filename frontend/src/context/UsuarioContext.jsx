import { createContext } from "react";

import useAuth from "../hooks/useAuth";

const Contexto = createContext();

function UsuarioProvider({ children }) {
  const { autenticado, registro, logout, login } = useAuth();

  return (
    <Contexto.Provider value={{ autenticado, registro, logout, login }}>
      {children}
    </Contexto.Provider>
  );
}

export { Contexto, UsuarioProvider };
