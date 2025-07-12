import { setupWorker } from 'msw/browser';
import { authHandlers, expenseHandlers, groupHandlers } from './handlers'

export const worker = setupWorker(
    ...authHandlers,
    ...groupHandlers,
    ...expenseHandlers
);