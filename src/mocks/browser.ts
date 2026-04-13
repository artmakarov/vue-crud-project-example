import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { ApplicantsDB } from './db';

ApplicantsDB.seed([
  {
    fullName: 'Иванов Иван Иванович',
    phone: '+7 (900) 123-45-67',
    status: 'new',
  },
  {
    fullName: 'Петрова Мария Сергеевна',
    phone: '+7 (900) 765-43-21',
    status: 'in_work',
  },
  {
    fullName: 'Сидоров Алексей Петрович',
    phone: '+7 (900) 111-22-33',
    status: 'done',
  },
  {
    fullName: 'Козлова Елена Владимировна',
    phone: '+7 (900) 222-33-44',
    status: 'new',
  },
  {
    fullName: 'Морозов Дмитрий Александрович',
    phone: '+7 (900) 333-44-55',
    status: 'in_work',
  },
]);

export const worker = setupWorker(...handlers);
