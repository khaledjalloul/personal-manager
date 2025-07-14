import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  About,
  Home,
  Diary,
  ManageExpenses,
  ExpensesStatistics,
  Journal,
  Notes,
  Hikes,
  VideoGames,
  Recipes,
  Piano,
  ExpensesWrapper,
  ExpensesDetails,
  MonthlyExpenses
} from "../pages";
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
          path: "/about",
          element: <About />,
        },
        {
          path: "/diary",
          element: <Diary />,
        },
        {
          path: "/journal",
          element: <Journal />,
        },
        {
          path: "/notes",
          element: <Notes />,
        },
        {
          path: "/piano",
          element: <Piano />,
        },
        {
          path: "/hikes",
          element: <Hikes />,
        },
        {
          path: "/games",
          element: <VideoGames />,
        },
        {
          path: "/recipes",
          element: <Recipes />,
        },
        {
          path: "/expenses",
          element: <ExpensesWrapper />,
          children: [
            {
              path: "/expenses",
              element: <ExpensesStatistics />,
            },
            {
              path: "/expenses/details",
              element: <ExpensesDetails />,
            },
            {
              path: "/expenses/monthly",
              element: <MonthlyExpenses />,
            },
            {
              path: "/expenses/manage",
              element: <ManageExpenses />,
            },
          ]
        }
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};
