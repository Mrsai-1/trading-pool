import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./common/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./basic/PublicRoute";
import CronSettings from "./common/CronSettings";
import MakeAnAdmin from "./common/MakeAnAdmin";
import ErrorBoundary from "./basic/errorBoundary"; // Import the Error Boundary

// Lazy-loaded components
// const Dashboard = lazy(() => import("./components/Dashboard"));
// const NotFound = lazy(() => import("./components/NotFound"));
// const Layout = lazy(() => import("./components/Layout"));
// const Login = lazy(() => import("./components/Login"));
// const Controls = lazy(() => import("./components/Controls"));
// const Api = lazy(() => import("./components/Api"));
// const AllDataTable = lazy(() => import("./common/AllDataTable"));
// const AddCoins = lazy(() => import("./components/AddCoins"));

import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import Controls from "./components/Controls";
import Api from "./components/Api";
import AllDataTable from "./common/AllDataTable";
import AddCoins from "./components/AddCoins";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/api", element: <Api /> },
        { path: "/controls", element: <Controls /> },
        { path: "/addcoins", element: <AddCoins /> },
        { path: "/allDataTable", element: <AllDataTable /> },
        { path: "/cronsetting", element: <CronSettings /> },
        { path: "/makeadmin", element: <MakeAnAdmin /> },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <ErrorBoundary>
        {/* <Suspense fallback={<Loader />}> */}
          <RouterProvider router={router} />
        {/* </Suspense> */}
      </ErrorBoundary>
    </>
  );
}

export default App;
