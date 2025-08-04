import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configura o "worker" com os manipuladores que criamos
export const worker = setupWorker(...handlers);