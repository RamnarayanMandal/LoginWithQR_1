import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Logout from './pages/Logout';


const root = ReactDOM.createRoot(document.getElementById('root'));
const id = localStorage.getItem("id");

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/login/:panshopOwner_id", element: <Login /> },
      {path:"/logout", element:<Logout/>},
      { path: id ? "/admin" : null, element: id ? <Admin /> : null },
      
    ]
  }
]);
root.render(
  <React.StrictMode>
   <RouterProvider router={router}/>
  </React.StrictMode>
);