import { User, Group, Expense, Income, ExpensesCategory } from '../types';

export const user: User = {
    id: 1,
    name: 'John Doe',
    email: 'jdoe@hotmail.com',
    token: 'fake-jwt-token'
};

export const groups: Group[] = [{
    id: 1,
    name: 'Group 1',
    subject: 'Subject 1',
    location: 'Location 1',
    time: new Date(),
    maxUsers: 10,
    notes: 'Notes for Group 1',
    admin: user,
    joinsGroups: []
}];

export const expensesCategories: ExpensesCategory[] = [
    { id: 1, name: 'Groceries', color: 'green' },
    { id: 2, name: 'Tools/Services', color: 'yellow' },
    { id: 3, name: 'Entertainment', color: 'purple' },
    { id: 4, name: 'Housing', color: 'orange' },
    { id: 5, name: 'One-time', color: 'blue' },
    { id: 6, name: 'Tuition', color: 'red' },
];

export const expenses: Expense[] = [
    {
        id: 1,
        date: new Date("2025-07-01"),
        category: expensesCategories[0],
        description: 'Lunch at the cafe',
        vendor: 'Cafe XYZ',
        amount: 15.99,
        tags: ['lunch', 'cafe'],
        type: 'manual'
    },
    {
        id: 2,
        date: new Date("2025-07-05"),
        category: expensesCategories[1],
        description: 'Bus ticket',
        vendor: 'City Bus',
        amount: 2.50,
        tags: ['transport', 'bus'],
        type: 'auto'
    },
    {
        id: 3,
        date: new Date("2024-12-20"),
        category: expensesCategories[2],
        description: 'Movie ticket',
        vendor: 'Cinema ABC',
        amount: 12.00,
        tags: ['movie', 'entertainment'],
        type: 'manual'
    },
    {
        id: 4,
        date: new Date("2025-02-10"),
        category: expensesCategories[3],
        description: 'Electricity bill',
        vendor: 'Power Company',
        amount: 45.00,
        tags: ['utilities', 'electricity'],
        type: 'auto'
    }
];

export const incomes: Income[] = [
    {
        id: 1,
        date: new Date(),
        source: 'Salary',
        amount: 3000.00
    },
    {
        id: 2,
        date: new Date(),
        source: 'Freelance Work',
        amount: 1500.00
    }
];