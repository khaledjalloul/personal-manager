import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { About, CreateGroup, Home, Diary, ViewExpenses, ManageExpenses, ExpensesStatistics, Journal, Notes, Hikes, Games, Recipes, Piano, ExpensesWrapper, ExpensesSummary } from "../pages";
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
              element: <ViewExpenses />,
            },
            {
              path: "/expenses/manage",
              element: <ManageExpenses />,
            },
            {
              path: "/expenses/statistics",
              element: <ExpensesStatistics />,
            },
            {
              path: "/expenses/summary",
              element: <ExpensesSummary />,
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
