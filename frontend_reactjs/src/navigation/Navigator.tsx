import { RouterProvider, createHashRouter } from "react-router-dom";
import {
  About,
  Home,
  DiaryWrapper,
  DailyDiary,
  Journal,
  Notes,
  Hikes,
  VideoGames,
  Recipes,
  Piano,
  ExpensesWrapper,
  Account,
  ExpensesStatistics,
  MonthlyExpenses,
  ExpensesDetails,
  ManageExpenses,
  MonthlyDiary
} from "../pages";
import { PageNotFound } from "./404";
import { Authenticator } from "./Authenticator";

export const Navigator = () => {
  const router = createHashRouter([
    {
      path: "/",
      element: <Authenticator />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/expenses",
          element: <ExpensesWrapper />,
          children: [
            {
              path: "/expenses",
              element: <ExpensesStatistics />
            },
            {
              path: "/expenses/monthly",
              element: <MonthlyExpenses />
            },
            {
              path: "/expenses/details",
              element: <ExpensesDetails />
            },
            {
              path: "/expenses/manage",
              element: <ManageExpenses />
            }
          ]
        },
        {
          path: "/diary",
          element: <DiaryWrapper />,
          children: [
            {
              path: "/diary",
              element: <DailyDiary />
            },
            {
              path: "/diary/monthly",
              element: <MonthlyDiary />
            }
          ]
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
          path: "/account",
          element: <Account />
        },
        {
          path: "/recipes",
          element: <Recipes />,
        },
        {
          path: "/journal",
          element: <Journal />,
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
