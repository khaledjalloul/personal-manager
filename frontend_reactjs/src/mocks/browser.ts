import { setupWorker } from 'msw/browser';
import { authHandlers, expenseHandlers, groupHandlers, hikeHandlers, pianoHandlers } from './handlers'

export const worker = setupWorker(
    ...authHandlers,
    ...groupHandlers,
    ...expenseHandlers,
    ...hikeHandlers,
    ...pianoHandlers
);