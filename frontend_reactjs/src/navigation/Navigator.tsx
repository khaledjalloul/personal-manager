import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { About, CreateGroup, Home } from "../pages";
import { PageNotFound } from "./404";
import { Authenticator } from "./Authenticator";

export const Navigator = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Authenticator />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/create",
          element: <CreateGroup />,
        },
        {
          path: "/about",
          element: <About />,
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};
