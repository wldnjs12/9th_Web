import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <LoginPage /> }, 
      { path: "*", element: <NotFoundPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <HomePage /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
