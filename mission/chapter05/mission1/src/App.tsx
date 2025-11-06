import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> }, 
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
