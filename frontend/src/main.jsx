import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Rotas
import Home from "./routes/Home.jsx";
import Login from "./routes/Auth/Login.jsx";
import Register from "./routes/Auth/Register.jsx"
import Perfil from "./routes/Usuarios/Perfil.jsx";
import MeusJogos from "./routes/Jogos/MeusJogos.jsx";
import CadastroJogo from "./routes/Jogos/CadastroJogo.jsx";
import EditarJogo from "./routes/Jogos/EditarJogo.jsx";
import JogoDetalhes from "./routes/Jogos/JogoDetalhes.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/registro",
        element: <Register />,
      },
      {
        path: "/usuario/perfil",
        element: <Perfil />,
      },
      {
        path: "/jogos/meusjogos",
        element: <MeusJogos />,
      },
      {
        path: "/jogos/cadastrar",
        element: <CadastroJogo />,
      },
      {
        path: "/jogos/editar/:id",
        element: <EditarJogo />,
      },
      {
        path: "/jogos/:id",
        element: <JogoDetalhes />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
