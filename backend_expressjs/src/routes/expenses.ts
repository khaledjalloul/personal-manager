import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: `Hello ${req.user?.email}, here are your expenses.` });
});

export default router;


//  // Expenses
//   http.get<PathParams, DefaultBodyType, Expense[]>('/expenses', ({ request }) => {
//     const url = new URL(request.url)
//     var type = url.searchParams.get('type')
//     var searchText = url.searchParams.get('searchText') ?? "";

//     var expensesToReturn = expenses;

//     if (type && type !== "all")
//       expensesToReturn = expenses.filter(expense => expense.type === type);

//     if (searchText) {
//       expensesToReturn = expensesToReturn.filter(expense =>
//         expense.description.toLowerCase().includes(searchText.toLowerCase()) ||
//         expense.vendor.toLowerCase().includes(searchText.toLowerCase()) ||
//         expense.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())) ||
//         (expense.category && expense.category.name.toLowerCase().includes(searchText.toLowerCase()))
//       )
//     }

//     return HttpResponse.json(expensesToReturn);
//   }),
//   http.post<PathParams, CreateExpenseRequestBody, Expense>('/expenses', async ({ request }) => {
//     const requestBody = await request.clone().json() as CreateExpenseRequestBody;
//     const category = expensesCategories.find(cat => cat.id === requestBody.categoryId);
//     if (category) {
//       const newExpense: Expense = {
//         id: expenses.length > 0 ? Math.max(...expenses.map(expense => expense.id)) + 1 : 0,
//         ...requestBody,
//         category
//       }
//       expenses.push(newExpense);
//       return HttpResponse.json(newExpense);
//     }
//   }),
//   http.post<PathParams, EditExpenseRequestBody, Expense>('/expenses/:id', async ({ request, params }) => {
//     const requestBody = await request.clone().json() as EditExpenseRequestBody;
//     const expenseId = parseInt(params.id as string);
//     const existingIndex = expenses.findIndex(expense => expense.id === expenseId);
//     if (existingIndex !== -1) {
//       const category = expensesCategories.find(cat => cat.id === requestBody.categoryId) ?? expenses[existingIndex].category
//       expenses[existingIndex] = { ...expenses[existingIndex], ...requestBody, category };
//       return HttpResponse.json(expenses[existingIndex]);
//     }
//   }),
//   http.delete<PathParams, DeleteExpenseRequestBody>('/expenses/:id', ({ params }) => {
//     const expenseId = parseInt(params.id as string);
//     const existingIndex = expenses.findIndex(expense => expense.id === expenseId);
//     if (existingIndex !== -1) {
//       expenses.splice(existingIndex, 1);
//       return HttpResponse.json({ message: 'Expense deleted successfully' });
//     }
//   }),
//   // Incomes
//   http.get<PathParams, DefaultBodyType, Income[]>('/expenses/incomes', () => HttpResponse.json(incomes)),
//   http.post<PathParams, CreateIncomeRequestBody, Income>('/expenses/incomes', async ({ request }) => {
//     const requestBody = await request.clone().json() as CreateIncomeRequestBody;
//     const newIncome: Income = {
//       id: incomes.length > 0 ? Math.max(...incomes.map(income => income.id)) + 1 : 0,
//       ...requestBody
//     }
//     incomes.push(newIncome);
//     return HttpResponse.json(newIncome);
//   }),
//   http.post<PathParams, EditIncomeRequestBody, Income>('/expenses/incomes/:id', async ({ request, params }) => {
//     const requestBody = await request.clone().json() as EditIncomeRequestBody;
//     const incomeId = parseInt(params.id as string);
//     const existingIndex = incomes.findIndex(income => income.id === incomeId);
//     if (existingIndex !== -1) {
//       incomes[existingIndex] = { ...incomes[existingIndex], ...requestBody };
//       return HttpResponse.json(incomes[existingIndex]);
//     }
//   }),
//   http.delete<PathParams, DeleteIncomeRequestBody>('/expenses/incomes/:id', ({ params }) => {
//     const incomeId = parseInt(params.id as string);
//     const existingIndex = incomes.findIndex(income => income.id === incomeId);
//     if (existingIndex !== -1) {
//       incomes.splice(existingIndex, 1);
//       return HttpResponse.json({ message: 'Income deleted successfully' });
//     }
//   }),
//   // Categories
//   http.get<PathParams, DefaultBodyType, ExpensesCategory[]>('/expenses/categories', () => {
//     return HttpResponse.json(expensesCategories);
//   }),
//   http.post<PathParams, CreateExpensesCategoryRequestBody, ExpensesCategory>('/expenses/categories', async ({ request }) => {
//     const requestBody = await request.clone().json() as CreateExpensesCategoryRequestBody;
//     const newCategory: ExpensesCategory = {
//       id: expensesCategories.length > 0 ? Math.max(...expensesCategories.map(category => category.id)) + 1 : 0,
//       ...requestBody
//     };
//     expensesCategories.push(newCategory);
//     return HttpResponse.json(newCategory);
//   }),
//   http.post<PathParams, EditExpensesCategoryRequestBody, ExpensesCategory>('/expenses/categories/:id', async ({ request, params }) => {
//     const requestBody = await request.clone().json() as EditExpensesCategoryRequestBody;
//     const categoryId = parseInt(params.id as string);
//     const existingIndex = expensesCategories.findIndex(category => category.id === categoryId);
//     if (existingIndex !== -1) {
//       expensesCategories[existingIndex] = { ...expensesCategories[existingIndex], ...requestBody };
//       return HttpResponse.json(expensesCategories[existingIndex]);
//     }
//   }),
//   http.delete<PathParams, DeleteExpensesCategoryRequestBody>('/expenses/categories/:id', ({ params }) => {
//     const categoryId = parseInt(params.id as string);
//     const existingIndex = expensesCategories.findIndex(category => category.id === categoryId);
//     if (existingIndex !== -1) {
//       expenses.forEach(expense => {
//         if (expense.category && expense.category.id === categoryId) {
//           expense.category = undefined;
//         }
//       });
//       expensesCategories.splice(existingIndex, 1);
//       return HttpResponse.json({ message: 'Category deleted successfully' });
//     }
//   }),
//   // Category Keywords
//   http.get<PathParams, DefaultBodyType, ExpensesCategoryKeyword[]>('/expenses/categories/keywords', ({ request }) => {
//     const url = new URL(request.url)
//     var categoryId = url.searchParams.get('categoryId') ?? "0";

//     var keywordsToReturn = expensesCategoryKeywords.filter(keyword => (
//       keyword.category.id === parseInt(categoryId)
//     ));

//     return HttpResponse.json(keywordsToReturn);
//   }),
//   http.post<PathParams, CreateExpensesCategoryKeywordRequestBody, ExpensesCategoryKeyword>('/expenses/categories/keywords', async ({ request }) => {
//     const requestBody = await request.clone().json() as CreateExpensesCategoryKeywordRequestBody;
//     const category = expensesCategories.find(cat => cat.id === requestBody.categoryId);
//     if (category) {
//       const newKeyword: ExpensesCategoryKeyword = {
//         id: expensesCategoryKeywords.length > 0 ? Math.max(...expensesCategoryKeywords.map(keyword => keyword.id)) + 1 : 0,
//         ...requestBody,
//         category
//       }
//       expensesCategoryKeywords.push(newKeyword);
//       return HttpResponse.json(newKeyword);
//     }
//   }),
//   http.delete<PathParams, DeleteExpensesCategoryKeywordRequestBody>('/expenses/categories/keywords/:id', ({ params }) => {
//     const keywordId = parseInt(params.id as string);
//     const existingIndex = expensesCategoryKeywords.findIndex(keyword => keyword.id === keywordId);
//     if (existingIndex !== -1) {
//       expensesCategoryKeywords.splice(existingIndex, 1);
//       return HttpResponse.json({ message: 'Keyword deleted successfully' });
//     }
//   }),
