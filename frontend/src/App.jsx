import { Outlet } from "react-router-dom";

// Componentes
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import Container from "./components/layouts/Container";
import Mensagem from "./components/layouts/Mensagem";

// Contexto
import { UsuarioProvider } from "./context/UsuarioContext";

function App() {
  return (
    <div className="App">
      <UsuarioProvider>
        <Navbar />
        <Mensagem />
        <Container>
          <Outlet />
        </Container>
        <Footer />
      </UsuarioProvider>
    </div>
  );
}

export default App;
