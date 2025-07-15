import { DefaultBodyType, http, HttpResponse, PathParams } from 'msw';
import {
  User,
  Expense,
  Income,
  ExpensesCategory,
  Hike,
  PianoPiece,
  Note,
  NoteCategory,
  DiaryEntry,
  VideoGame,
  ExpensesCategoryKeyword
} from '../types';
import {
  user,
  expenses,
  incomes,
  expensesCategories,
  hikes,
  pianoPieces,
  noteCategories,
  notes,
  diaryEntries,
  videoGames,
  expensesCategoryKeywords
} from './data';

const authHandlers = [
  http.post<PathParams, DefaultBodyType, User>('/auth/signin', () => {
    return HttpResponse.json(user)
  })
];

const expenseHandlers = [
  http.get<PathParams, DefaultBodyType, Expense[]>('/expenses', ({ request }) => {
    const url = new URL(request.url)
    var type = url.searchParams.get('type')
    var searchText = url.searchParams.get('searchText') ?? "";

    var expensesToReturn = expenses;

    if (type && type !== "all")
      expensesToReturn = expenses.filter(expense => expense.type === type);

    if (searchText) {
      expensesToReturn = expensesToReturn.filter(expense =>
        expense.description.toLowerCase().includes(searchText.toLowerCase()) ||
        expense.vendor.toLowerCase().includes(searchText.toLowerCase()) ||
        expense.category.name.toLowerCase().includes(searchText.toLowerCase()) ||
        expense.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      )
    }

    return HttpResponse.json(expensesToReturn);
  }),
  http.get<PathParams, DefaultBodyType, Income[]>('/incomes', () => HttpResponse.json(incomes)),
  http.get<PathParams, DefaultBodyType, ExpensesCategory[]>('/expenses/categories', () => {
    return HttpResponse.json(expensesCategories);
  }),
  http.get<PathParams, DefaultBodyType, ExpensesCategoryKeyword[]>('/expenses/categories/keywords', ({ request }) => {
    const url = new URL(request.url)
    var categoryId = url.searchParams.get('categoryId') ?? "0";

    var keywordsToReturn = expensesCategoryKeywords.filter(keyword => (
      keyword.category.id === parseInt(categoryId)
    ));

    return HttpResponse.json(keywordsToReturn);
  }),
];

const hikeHandlers = [
  http.get<PathParams, DefaultBodyType, Hike[]>('/hikes', () => HttpResponse.json(hikes)),
];

const pianoHandlers = [
  http.get<PathParams, DefaultBodyType, PianoPiece[]>('/piano', () => HttpResponse.json(pianoPieces))
];

const noteHandlers = [
  http.get<PathParams, DefaultBodyType, NoteCategory[]>('/notes/categories', () => (
    HttpResponse.json(noteCategories)
  )),
  http.get<PathParams, DefaultBodyType, Note[]>('/notes', ({ request }) => {
    const url = new URL(request.url)
    var categoryId = url.searchParams.get('categoryId') ?? ""

    var notesToReturn = notes;

    if (categoryId) {
      notesToReturn = notes.filter(note => note.category.id === parseInt(categoryId));
    }

    return HttpResponse.json(notesToReturn)
  })
];

const diaryHandlers = [
  http.get<PathParams, DefaultBodyType, DiaryEntry[]>('/diary', ({ request }) => {
    const url = new URL(request.url)
    var year = url.searchParams.get('year') ?? new Date().getFullYear().toString();
    var month = url.searchParams.get('month') ?? new Date().getMonth().toString();
    var searchText = url.searchParams.get('searchText') ?? "";

    var entriesToReturn = diaryEntries.filter(entry => (
      entry.date.getFullYear() === parseInt(year) &&
      entry.date.getMonth() === parseInt(month) &&
      (
        searchText ? (
          entry.content.toLowerCase().includes(searchText.toLowerCase()) ||
          entry.workContent.toLowerCase().includes(searchText.toLowerCase())
        ) : true
      )
    ));

    return HttpResponse.json(entriesToReturn)
  })
];

const videoGameHandlers = [
  http.get<PathParams, DefaultBodyType, VideoGame[]>('/video-games', () => HttpResponse.json(videoGames))
];

export const handlers = [
  ...authHandlers,
  ...expenseHandlers,
  ...hikeHandlers,
  ...pianoHandlers,
  ...noteHandlers,
  ...diaryHandlers,
  ...videoGameHandlers
];