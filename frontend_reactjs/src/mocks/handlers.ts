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
  DiaryEntry
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
  diaryEntries
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

    const duplicatedExpenses = Array.from({ length: 25 }, () => expensesToReturn).flat();
    return HttpResponse.json(duplicatedExpenses);
  }),
  http.get<PathParams, DefaultBodyType, Income[]>('/incomes', () => {
    const duplicatedIncomes = Array.from({ length: 25 }, () => incomes).flat();
    return HttpResponse.json(duplicatedIncomes);
  }),
  http.get<PathParams, DefaultBodyType, ExpensesCategory[]>('/expenses/categories', () => {
    return HttpResponse.json(expensesCategories);
  }),
];

const hikeHandlers = [
  http.get<PathParams, DefaultBodyType, Hike[]>('/hikes', () => {
    const duplicatedHikes = Array.from({ length: 25 }, () => hikes).flat();
    return HttpResponse.json(duplicatedHikes)
  }),
];

const pianoHandlers = [
  http.get<PathParams, DefaultBodyType, PianoPiece[]>('/piano', () => {
    const duplicatedPianoPieces = Array.from({ length: 25 }, () => pianoPieces).flat();
    return HttpResponse.json(duplicatedPianoPieces)
  })
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
  http.get<PathParams, DefaultBodyType, DiaryEntry[]>('/diary', () => {
    const duplicatedDiaryEntries = Array.from({ length: 25 }, () => diaryEntries).flat();
    return HttpResponse.json(duplicatedDiaryEntries)
  })
];

export const handlers = [
  ...authHandlers,
  ...expenseHandlers,
  ...hikeHandlers,
  ...pianoHandlers,
  ...noteHandlers,
  ...diaryHandlers
];