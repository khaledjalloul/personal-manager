import { DefaultBodyType, http, HttpResponse, PathParams } from 'msw';
import { User, Group, Expense, Income, ExpensesCategory } from '../types';
import { CreateGroupRequestBody } from '../api';
import { groups, user, expenses, incomes, expensesCategories } from './data';

export const authHandlers = [
  http.post<PathParams, DefaultBodyType, User>('/auth/signin', () => {
    return HttpResponse.json(user)
  })
];

export const groupHandlers = [
  http.get<PathParams, DefaultBodyType, Group[]>('/groups', () => {
    return HttpResponse.json(groups);
  }),
  http.post<PathParams, CreateGroupRequestBody, Group>('/groups', async ({ request }) => {
    const reqBody = await request.json();
    const newGroup: Group = {
      id: 1,
      name: reqBody.name,
      subject: reqBody.subject,
      location: reqBody.location,
      time: new Date(),
      maxUsers: reqBody.maxUsers || 10,
      notes: reqBody.notes,
      admin: user,
      joinsGroups: [],
    }

    groups.push(newGroup);
    return HttpResponse.json(newGroup, { status: 201 });
  })
];

export const expenseHandlers = [
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