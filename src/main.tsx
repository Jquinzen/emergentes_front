import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

import App from "./App.tsx"
import Login from "./Login.tsx"
import Detalhes from "./Detalhes.tsx"
import MinhasReservas from "./MinhasReservas.tsx"
import CadCliente from "./CadCliente.tsx"

// ----------------- Rotas de Admin
import AdminLayout from "./admin/AdminLayout.tsx"
import AdminLogin from "./admin/AdminLogin.tsx"
import AdminDashboard from "./admin/AdminDashboard.tsx"

// Máquinas
import AdminMaquinas from "./admin/AdminMaquinas.tsx"
import AdminNovaMaquina from "./admin/AdminNovaMaquina.tsx"

// Reservas
import AdminReservas from "./admin/AdminReservas.tsx"

// Lavanderias
import AdminLavanderias from "./admin/AdminLavanderias.tsx"
import AdminNovaLavanderia from "./admin/AdminNovaLavanderia.tsx"


// // Cadastro de Admins (se for usar, descomente as linhas abaixo)
import AdminCadAdmin from "./admin/AdminCadAdmin.tsx"
import AdminNovoAdmin from "./admin/AdminNovoAdmin.tsx"

import Layout from "./Layout.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const rotas = createBrowserRouter([
  // login admin sem layout
  { path: "/admin/login", element: <AdminLogin /> },

  // área admin
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },

      // Máquinas
      { path: "maquinas", element: <AdminMaquinas /> },
      { path: "maquinas/nova", element: <AdminNovaMaquina /> },

      // Reservas
      { path: "reservas", element: <AdminReservas /> },

      // Lavanderias
      { path: "lavanderias", element: <AdminLavanderias /> },
      { path: "lavanderias/nova", element: <AdminNovaLavanderia /> },

      // // Admins (opcional)
       { path: "cadAdmin", element: <AdminCadAdmin /> },
     { path: "cadAdmin/novo", element: <AdminNovoAdmin /> },
    ],
  },

  // área pública
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "login", element: <Login /> },
      { path: "detalhes/:id", element: <Detalhes /> }, // id da máquina
      { path: "minhas-reservas", element: <MinhasReservas /> },
      { path: "cadCliente", element: <CadCliente /> },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>
)
