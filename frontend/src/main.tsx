import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './pages/App.tsx'
import './index.css'
import ErrorPage from "./error-page.tsx";
import LoginPage from "./pages/Login.tsx";
import OtpPage from "./pages/Otp.tsx";
import {AuthProvider} from "./auth/authprovider";
import Profile from "./pages/dashboard/Profile";
import EmployeeApp from "./pages/dashboard/Employees.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import {NavigationDemo, NavigationDemoRoutes} from "./pages/dashboard/NavigationDemo.tsx";
import LogoutPage from "./pages/Logout.tsx";
import SignupPage from "./pages/Signup.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App/>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/login/otp/",
    element: <OtpPage />,
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/dashboard/",
    element: (
      <Dashboard />
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard/profile",
        element: (
          <Profile/>
        ),
      },
      {
        path: "/dashboard/navigation/",
        element: (
          <NavigationDemo/>
        ),
        children: [
          {
            path: "*",
            element: (
              <NavigationDemoRoutes />
            ),
          }
        ]
      },
      {
        path: "/dashboard/employees/*",
        element: (
          <EmployeeApp/>
        ),
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
