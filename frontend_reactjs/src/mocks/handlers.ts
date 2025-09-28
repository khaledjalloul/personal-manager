import { DefaultBodyType, http, HttpResponse, PathParams } from 'msw';
import {
  User,
  Expense,
  Fund,
  ExpensesCategory,
  Hike,
  PianoPiece,
  Note,
  NoteCategory,
  DiaryEntry,
  VideoGame,
  JournalCategory,
  JournalSection,
  JournalEntry,
  ToDoTask,
  ToDoMilestone,
  ToDoTaskStatus,
  CalendarEntry,
} from '../types';
import {
  user,
  expenses,
  funds,
  expensesCategories,
  hikes,
  pianoPieces,
  noteCategories,
  notes,
  diaryEntries,
  videoGames,
  expensesStatistics,
  monthlyExpenses,
  journalCategories,
  journalSections,
  journalEntries,
  toDoTasks,
  toDoMilestones,
  calendarEntries,
} from './data';
import {
  CreateDiaryEntryRequestBody,
  CreateExpenseRequestBody,
  CreateExpensesCategoryRequestBody,
  CreateHikeRequestBody,
  CreateFundRequestBody,
  CreateNoteCategoryRequestBody,
  CreateNoteRequestBody,
  CreatePianoPieceRequestBody,
  CreateVideoGameRequestBody,
  DeleteExpenseRequestBody,
  DeleteExpensesCategoryRequestBody,
  DeleteHikeRequestBody,
  DeleteFundRequestBody,
  DeleteNoteCategoyRequestBody,
  DeleteNoteRequestBody,
  DeletePianoPieceRequestBody,
  DeleteVideoGameRequestBody,
  EditDiaryEntryRequestBody,
  EditExpenseRequestBody,
  EditExpensesCategoryRequestBody,
  EditHikeRequestBody,
  EditFundRequestBody,
  EditNoteCategoryRequestBody,
  EditNoteRequestBody,
  EditPianoPieceRequestBody,
  EditVideoGameRequestBody,
  GetExpensesStatisticsResponse,
  GetMonthlyExpensesResponse
} from '../api';
import dayjs from 'dayjs';

// ############### Auth ###############

const authHandlers = [
  http.post<PathParams, DefaultBodyType, User>('/auth/signin', () => HttpResponse.json(user))
];

// ############### Users ###############

const userHandlers = [
  http.get<PathParams, DefaultBodyType, User>('/users/me', () => HttpResponse.json(user)),
  http.post<PathParams, DefaultBodyType, User>('/users/me', async ({ request }) => {
    const requestBody = await request.clone().json() as Partial<User>;
    const updatedUser: User = { ...user, ...requestBody };
    return HttpResponse.json(updatedUser);
  })
];

// ############### Expenses ###############

const expenseHandlers = [
  // Expenses
  http.get<PathParams, DefaultBodyType, Expense[]>('/expenses', () => HttpResponse.json(expenses)),
  http.post<PathParams, CreateExpenseRequestBody, Expense>('/expenses', async ({ request }) => {
    const requestBody = await request.clone().json() as CreateExpenseRequestBody;
    const category = expensesCategories.find(cat => cat.id === requestBody.categoryId);
    if (category) {
      const newExpense: Expense = {
        id: expenses.length > 0 ? Math.max(...expenses.map(expense => expense.id)) + 1 : 0,
        ...requestBody,
        category
      }
      expenses.push(newExpense);
      return HttpResponse.json(newExpense);
    }
  }),
  http.post<PathParams, EditExpenseRequestBody, Expense>('/expenses/:id', async ({ request, params }) => {
    const requestBody = await request.clone().json() as EditExpenseRequestBody;
    const expenseId = parseInt(params.id as string);
    const existingIndex = expenses.findIndex(expense => expense.id === expenseId);
    if (existingIndex !== -1) {
      const category = expensesCategories.find(cat => cat.id === requestBody.categoryId) ?? expenses[existingIndex].category
      expenses[existingIndex] = { ...expenses[existingIndex], ...requestBody, category };
      return HttpResponse.json(expenses[existingIndex]);
    }
  }),
  http.delete<PathParams, DeleteExpenseRequestBody>('/expenses/:id', ({ params }) => {
    const expenseId = parseInt(params.id as string);
    const existingIndex = expenses.findIndex(expense => expense.id === expenseId);
    if (existingIndex !== -1) {
      expenses.splice(existingIndex, 1);
      return HttpResponse.json({ message: 'Expense deleted successfully' });
    }
  }),
  // Funds
  http.get<PathParams, DefaultBodyType, Fund[]>('/expenses/funds', () => HttpResponse.json(funds)),
  http.post<PathParams, CreateFundRequestBody, Fund>('/expenses/funds', async ({ request }) => {
    const requestBody = await request.clone().json() as CreateFundRequestBody;
    const newFund: Fund = {
      id: funds.length > 0 ? Math.max(...funds.map(fund => fund.id)) + 1 : 0,
      ...requestBody
    }
    funds.push(newFund);
    return HttpResponse.json(newFund);
  }),
  http.post<PathParams, EditFundRequestBody, Fund>('/expenses/funds/:id', async ({ request, params }) => {
    const requestBody = await request.clone().json() as EditFundRequestBody;
    const fundId = parseInt(params.id as string);
    const existingIndex = funds.findIndex(fund => fund.id === fundId);
    if (existingIndex !== -1) {
      funds[existingIndex] = { ...funds[existingIndex], ...requestBody };
      return HttpResponse.json(funds[existingIndex]);
    }
  }),
  http.delete<PathParams, DeleteFundRequestBody>('/expenses/funds/:id', ({ params }) => {
    const fundId = parseInt(params.id as string);
    const existingIndex = funds.findIndex(fund => fund.id === fundId);
    if (existingIndex !== -1) {
      funds.splice(existingIndex, 1);
      return HttpResponse.json({ message: 'Fund deleted successfully' });
    }
  }),
  // Categories
  http.get<PathParams, DefaultBodyType, ExpensesCategory[]>('/expenses/categories', () => HttpResponse.json(expensesCategories)),
  http.post<PathParams, CreateExpensesCategoryRequestBody, ExpensesCategory>('/expenses/categories', async ({ request }) => {
    const requestBody = await request.clone().json() as CreateExpensesCategoryRequestBody;
    const newCategory: ExpensesCategory = {
      id: expensesCategories.length > 0 ? Math.max(...expensesCategories.map(category => category.id)) + 1 : 0,
      ...requestBody
    };
    expensesCategories.push(newCategory);
    return HttpResponse.json(newCategory);
  }),
  http.post<PathParams, EditExpensesCategoryRequestBody, ExpensesCategory>('/expenses/categories/:id', async ({ request, params }) => {
    const requestBody = await request.clone().json() as EditExpensesCategoryRequestBody;
    const categoryId = parseInt(params.id as string);
    const existingIndex = expensesCategories.findIndex(category => category.id === categoryId);
    if (existingIndex !== -1) {
      expensesCategories[existingIndex] = { ...expensesCategories[existingIndex], ...requestBody };
      return HttpResponse.json(expensesCategories[existingIndex]);
    }
  }),
  http.delete<PathParams, DeleteExpensesCategoryRequestBody>('/expenses/categories/:id', ({ params }) => {
    const categoryId = parseInt(params.id as string);
    const existingIndex = expensesCategories.findIndex(category => category.id === categoryId);
    if (existingIndex !== -1) {
      expenses.forEach(expense => {
        if (expense.category && expense.category.id === categoryId) {
          expense.category = undefined;
        }
      });
      expensesCategories.splice(existingIndex, 1);
      return HttpResponse.json({ message: 'Category deleted successfully' });
    }
  }),
  // Statistics
  http.get<PathParams, DefaultBodyType, GetExpensesStatisticsResponse>('/expenses/statistics', () => HttpResponse.json(expensesStatistics)),
  // Monthly Expenses
  http.get<PathParams, DefaultBodyType, GetMonthlyExpensesResponse>('/expenses/monthly', () => HttpResponse.json(monthlyExpenses))
];

// ############### Diary ###############

const diaryHandlers = [
  http.get<PathParams, DefaultBodyType, DiaryEntry[]>('/diary/daily', ({ request }) => {
    const url = new URL(request.url)
    var year = url.searchParams.get('year') ?? new Date().getFullYear().toString();
    var month = url.searchParams.get('month') ?? new Date().getMonth().toString();

    var entriesToReturn = diaryEntries.filter(entry => (
      new Date(entry.date).getFullYear() === parseInt(year) &&
      new Date(entry.date).getMonth() === parseInt(month)
    ));

    return HttpResponse.json(entriesToReturn)
  }),
  http.post<PathParams, CreateDiaryEntryRequestBody, DiaryEntry>('/diary', async ({ request }) => {
    const requestBody = await request.clone().json() as CreateDiaryEntryRequestBody;
    const newEntry: DiaryEntry = {
      id: diaryEntries.length > 0 ? Math.max(...diaryEntries.map(entry => entry.id)) + 1 : 0,
      ...requestBody
    }
    diaryEntries.push(newEntry);
    return HttpResponse.json(newEntry);
  }),
  http.post<PathParams, EditDiaryEntryRequestBody, DiaryEntry>('/diary/:id', async ({ request, params }) => {
    const requestBody = await request.clone().json() as EditDiaryEntryRequestBody;
    const entryId = parseInt(params.id as string);
    const existingIndex = diaryEntries.findIndex(entry => entry.id === entryId);
    if (existingIndex !== -1) {
      diaryEntries[existingIndex] = { ...diaryEntries[existingIndex], ...requestBody };
      return HttpResponse.json(diaryEntries[existingIndex]);
    }
  })
];

// ############### Journal ###############

const journalHandlers = [
  // Categories
  http.get<PathParams, DefaultBodyType, JournalCategory[]>('/journal/categories', () => HttpResponse.json(journalCategories)),
  // Sections
  http.get<PathParams, DefaultBodyType, JournalSection[]>('/journal/sections', ({ request }) => {
    const url = new URL(request.url)
    var categoryId = url.searchParams.get('categoryId') ?? "";

    if (categoryId) {
      var sectionsToReturn;
      if (categoryId === "-1")
        sectionsToReturn = journalSections.filter(section => !section.category);
      else
        sectionsToReturn = journalSections.filter(section => section.category?.id === parseInt(categoryId));
      return HttpResponse.json(sectionsToReturn);
    } else return HttpResponse.json([]);
  }),
  // Entries
  http.get<PathParams, DefaultBodyType, JournalEntry[]>('/journal', ({ request }) => {
    const url = new URL(request.url)
    var sectionId = url.searchParams.get('sectionId') ?? "";

    var entriesToReturn = journalEntries;
    if (sectionId) {
      if (sectionId === "-1")
        entriesToReturn = journalEntries.filter(entry => !entry.section);
      else
        entriesToReturn = journalEntries.filter(entry => entry.section?.id === parseInt(sectionId));
    }
    return HttpResponse.json(entriesToReturn);
  }),
];

// ############### Calendar ###############

const calendarHandlers = [
  http.get<PathParams, DefaultBodyType, CalendarEntry[]>('/calendar', () => HttpResponse.json(calendarEntries))
];

// ############### To Do ###############

const toDoHandlers = [
  // Milestones
  http.get<PathParams, DefaultBodyType, ToDoMilestone[]>('/todo/milestones', () => HttpResponse.json(toDoMilestones)),
  // Tasks
  http.get<PathParams, DefaultBodyType, ToDoTask[]>('/todo', ({ request }) => {
    const url = new URL(request.url);
    const milestoneId = url.searchParams.get('milestoneId');
    const isArchived = url.searchParams.get('isArchived') === 'true';

    let tasksToReturn = toDoTasks;
    if (milestoneId)
      tasksToReturn = toDoTasks.filter(task => task.milestoneId === parseInt(milestoneId));
    else {
      tasksToReturn = toDoTasks.filter(task => !task.milestoneId);

      if (isArchived)
        tasksToReturn = tasksToReturn.filter(task => (!isArchived || [ToDoTaskStatus.Completed, ToDoTaskStatus.NotCompleted].includes(task.status)));
      else
        tasksToReturn = tasksToReturn.filter(task => task.status === ToDoTaskStatus.Pending);
    }

    return HttpResponse.json(tasksToReturn);
  }),
];

// ############### Notes ###############

const noteHandlers = [
  http.get<PathParams, DefaultBodyType, Note[]>('/notes', ({ request }) => {
    const url = new URL(request.url)
    var categoryId = url.searchParams.get('categoryId') ?? ""
    var notesToReturn = notes;
    if (categoryId) {
      if (categoryId === "-1")
        notesToReturn = notes.filter(note => !note.category);
      else
        notesToReturn = notes.filter(note => note.category?.id === parseInt(categoryId));
    }
    return HttpResponse.json(notesToReturn)
  }),
  http.post<PathParams, CreateNoteRequestBody, Note>('/notes', async ({ request }) => {
    const requestBody = await request.clone().json() as CreateNoteRequestBody;
    const category = noteCategories.find(cat => cat.id === requestBody.categoryId);
    if (category) {
      const newNote: Note = {
        id: notes.length > 0 ? Math.max(...notes.map(category => category.id)) + 1 : 0,
        ...requestBody,
        category
      };
      notes.push(newNote);
      return HttpResponse.json(newNote);
    }
  }),
  http.post<PathParams, EditNoteRequestBody, Note>('/notes/:id', async ({ request, params }) => {
    const requestBody = await request.clone().json() as EditNoteRequestBody;
    const noteId = parseInt(params.id as string);
    const existingIndex = notes.findIndex(note => note.id === noteId);
    if (existingIndex !== -1) {
      const category = noteCategories.find(cat => cat.id === requestBody.categoryId) ?? notes[existingIndex].category;
      notes[existingIndex] = { ...notes[existingIndex], ...requestBody, category };
      return HttpResponse.json(notes[existingIndex]);
    }
  }),
  http.delete<PathParams, DeleteNoteRequestBody>('/notes/:id', ({ params }) => {
    const noteId = parseInt(params.id as string);
    const existingIndex = notes.findIndex(note => note.id === noteId);
    if (existingIndex !== -1) {
      notes.splice(existingIndex, 1);
      return HttpResponse.json({ message: 'Note deleted successfully' });
    }
  }),
  http.get<PathParams, DefaultBodyType, NoteCategory[]>('/notes/categories', () => HttpResponse.json(noteCategories)),
  http.post<PathParams, CreateNoteCategoryRequestBody, NoteCategory>('/notes/categories', async ({ request }) => {
    const requestBody = await request.clone().json() as CreateNoteCategoryRequestBody;
    const newCategory: NoteCategory = {
      id: noteCategories.length > 0 ? Math.max(...noteCategories.map(category => category.id)) + 1 : 0,
      ...requestBody
    };
    noteCategories.push(newCategory);
    return HttpResponse.json(newCategory);
  }),
  http.post<PathParams, EditNoteCategoryRequestBody, NoteCategory>('/notes/categories/:id', async ({ request, params }) => {
    const requestBody = await request.clone().json() as EditNoteCategoryRequestBody;
    const categoryId = parseInt(params.id as string);
    const existingIndex = noteCategories.findIndex(category => category.id === categoryId);
    if (existingIndex !== -1) {
      noteCategories[existingIndex] = { ...noteCategories[existingIndex], ...requestBody };
      return HttpResponse.json(noteCategories[existingIndex]);
    }
  }),
  http.delete<PathParams, DeleteNoteCategoyRequestBody>('/notes/categories/:id', ({ params }) => {
    const categoryId = parseInt(params.id as string);
    const existingIndex = noteCategories.findIndex(category => category.id === categoryId);
    if (existingIndex !== -1) {
      notes.forEach(note => {
        if (note.category && note.category.id === categoryId) {
          note.category = undefined;
        }
      });
      noteCategories.splice(existingIndex, 1);
      return HttpResponse.json({ message: 'Category deleted successfully' });
    }
  })
];

// ############### Piano ###############

const pianoHandlers = [
  http.get<PathParams, DefaultBodyType, PianoPiece[]>('/piano', () => HttpResponse.json(pianoPieces)),
  http.post<PathParams, CreatePianoPieceRequestBody, PianoPiece>('/piano', async ({ request }) => {
    const requestBody = await request.clone().json() as CreatePianoPieceRequestBody;
    const newPianoPiece: PianoPiece = {
      id: pianoPieces.length > 0 ? Math.max(...pianoPieces.map(piece => piece.id)) + 1 : 0,
      ...requestBody,
      monthLearned: requestBody.monthLearned ? dayjs(requestBody.monthLearned).toDate() : undefined
    }
    pianoPieces.push(newPianoPiece);
    return HttpResponse.json(newPianoPiece);
  }),
  http.post<PathParams, EditPianoPieceRequestBody, PianoPiece>('/piano/:id', async ({ request, params }) => {
    const requestBody = await request.clone().json() as EditPianoPieceRequestBody;
    const pieceId = parseInt(params.id as string);
    const existingIndex = pianoPieces.findIndex(piece => piece.id === pieceId);
    if (existingIndex !== -1) {
      pianoPieces[existingIndex] = {
        ...pianoPieces[existingIndex],
        ...requestBody,
        monthLearned: requestBody.monthLearned ? dayjs(requestBody.monthLearned).toDate() : undefined
      };
      return HttpResponse.json(pianoPieces[existingIndex]);
    }
  }),
  http.delete<PathParams, DeletePianoPieceRequestBody>('/piano/:id', ({ params }) => {
    const pieceId = parseInt(params.id as string);
    const existingIndex = pianoPieces.findIndex(piece => piece.id === pieceId);
    if (existingIndex !== -1) {
      pianoPieces.splice(existingIndex, 1);
      return HttpResponse.json({ message: 'Piano piece deleted successfully' });
    }
  })
];

// ############### Hikes ###############

const hikeHandlers = [
  http.get<PathParams, DefaultBodyType, Hike[]>('/hikes', () => HttpResponse.json(hikes)),
  http.post<PathParams, CreateHikeRequestBody, Hike>('/hikes', async ({ request }) => {
    const requestBody = await request.clone().json() as CreateHikeRequestBody;
    const newHike: Hike = {
      id: hikes.length > 0 ? Math.max(...hikes.map(hike => hike.id)) + 1 : 0,
      ...requestBody
    }
    hikes.push(newHike);
    return HttpResponse.json(newHike);
  }),
  http.post<PathParams, EditHikeRequestBody, Hike>('/hikes/:id', async ({ request, params }) => {
    const requestBody = await request.clone().json() as EditHikeRequestBody;
    const hikeId = parseInt(params.id as string);
    const existingIndex = hikes.findIndex(hike => hike.id === hikeId);
    if (existingIndex !== -1) {
      hikes[existingIndex] = { ...hikes[existingIndex], ...requestBody };
      return HttpResponse.json(hikes[existingIndex]);
    }
  }),
  http.delete<PathParams, DeleteHikeRequestBody>('/hikes/:id', ({ params }) => {
    const hikeId = parseInt(params.id as string);
    const existingIndex = hikes.findIndex(hike => hike.id === hikeId);
    if (existingIndex !== -1) {
      hikes.splice(existingIndex, 1);
      return HttpResponse.json({ message: 'Hike deleted successfully' });
    }
  })
];

// ############### Video Games ###############

const videoGameHandlers = [
  http.get<PathParams, DefaultBodyType, VideoGame[]>('/video-games', () => HttpResponse.json(videoGames)),
  http.post<PathParams, CreateVideoGameRequestBody, VideoGame>('/video-games', async ({ request }) => {
    const requestBody = await request.clone().json() as CreateVideoGameRequestBody;
    const newVideoGame: VideoGame = {
      id: videoGames.length > 0 ? Math.max(...videoGames.map(game => game.id)) + 1 : 0,
      ...requestBody
    }
    videoGames.push(newVideoGame);
    return HttpResponse.json(newVideoGame);
  }),
  http.post<PathParams, EditVideoGameRequestBody, VideoGame>('/video-games/:id', async ({ request, params }) => {
    const requestBody = await request.clone().json() as EditVideoGameRequestBody;
    const gameId = parseInt(params.id as string);
    const existingIndex = videoGames.findIndex(game => game.id === gameId);
    if (existingIndex !== -1) {
      videoGames[existingIndex] = { ...videoGames[existingIndex], ...requestBody };
      return HttpResponse.json(videoGames[existingIndex]);
    }
  }),
  http.delete<PathParams, DeleteVideoGameRequestBody>('/video-games/:id', ({ params }) => {
    const gameId = parseInt(params.id as string);
    const existingIndex = videoGames.findIndex(game => game.id === gameId);
    if (existingIndex !== -1) {
      videoGames.splice(existingIndex, 1);
      return HttpResponse.json({ message: 'Video game deleted successfully' });
    }
  })
];

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...expenseHandlers,
  ...diaryHandlers,
  ...journalHandlers,
  ...calendarHandlers,
  ...toDoHandlers,
  ...noteHandlers,
  ...pianoHandlers,
  ...hikeHandlers,
  ...videoGameHandlers
];