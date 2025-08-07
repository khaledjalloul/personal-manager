import { RouterProvider, createHashRouter } from "react-router-dom";
import {
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
  MonthlyDiary,
  ToDoWrapper,
  GeneralToDo,
  ToDoMilestones
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
          path: "/journal",
          element: <Journal />,
        },
        {
          path: "/todo",
          element: <ToDoWrapper />,
          children: [
            {
              path: "/todo",
              element: <GeneralToDo />
            },
            {
              path: "/todo/milestones",
              element: <ToDoMilestones />
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
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};
