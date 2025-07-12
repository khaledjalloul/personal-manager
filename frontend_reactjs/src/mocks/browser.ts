import { setupWorker } from 'msw/browser';
import { authHandlers, expenseHandlers, groupHandlers, hikeHandlers } from './handlers'

export const worker = setupWorker(
    ...authHandlers,
    ...groupHandlers,
    ...expenseHandlers,
    ...hikeHandlers
);