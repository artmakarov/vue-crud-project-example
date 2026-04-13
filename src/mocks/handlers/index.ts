import type { HttpHandler } from 'msw';
import { applicantsHandlers } from './applicants';

export const handlers: HttpHandler[] = [...applicantsHandlers];
