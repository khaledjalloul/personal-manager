import { setupWorker } from 'msw/browser';
import { authHandlers, groupHandlers } from './handlers'

export const worker = setupWorker(
    ...authHandlers,
    ...groupHandlers
);