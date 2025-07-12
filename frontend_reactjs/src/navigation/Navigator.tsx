import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { About, CreateGroup, Home, Diary, ManageExpenses, ExpensesStatistics, Journal, Notes, Hikes, Games, Recipes, Piano, ExpensesWrapper, DailyExpenses, ExpensesTotals } from "../pages";
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
          element: <Games />,
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
              path: "/expenses/daily",
              element: <DailyExpenses />,
            },
            {
              path: "/expenses/totals",
              element: <ExpensesTotals />,
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
