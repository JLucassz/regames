// Hook para chamadas api com o backend
import api from "../utils/api";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";

export default function useAuth() {
  const [autenticado, setAutenticado] = useState(false);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAutenticado(true);
    }
  }, []);

  async function registro(usuario) {
    let msgText = "Cadastro realizado com sucesso";
    let msgType = "sucesso";

    try {
      const data = await api
        .post("/usuarios/registro", usuario)
        .then((response) => {
          return response.data;
        });

      await authUsuario(data);
    } catch (error) {
      msgText = error.response.data.message;
      msgType = "erro";
    }

    setFlashMessage(msgText, msgType);
  }

  async function login(usuario) {
    let msgText = "Login realizado com sucesso!";
    let msgType = "sucesso";

    try {
      const data = await api
        .post("/usuarios/login", usuario)
        .then((response) => {
          return response.data;
        });

      await authUsuario(data);
    } catch (error) {
      msgText = error.response.data.message;
      msgType = "erro";
    }

    setFlashMessage(msgText, msgType);
  }

  // Funçao de apoio para autenticar usuario (Tanto ao registrar e ao logar)
  async function authUsuario(data) {
    setAutenticado(true);
    localStorage.setItem("token", JSON.stringify(data.token));
    navigate("/");
  }

  async function logout() {
    const msgText = "Logout realizado com sucesso!";
    const msgType = "sucesso";

    setAutenticado(false);
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = undefined;
    navigate("/");

    setFlashMessage(msgText, msgType);
  }

  return { autenticado, registro, logout, login };
}
