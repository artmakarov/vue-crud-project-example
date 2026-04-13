import type { ApplicantStatusType, IApplicant } from '@/modules/applicants';
import { API_BASE_URL, IPaginatedResponse } from '@/shared';
import { delay, http, type HttpHandler, HttpResponse } from 'msw';
import { ApplicantsDB } from '../db';

// Константы задержек для имитации сетевой задержки
const DELAY = {
  LIST: 300,
  GET_BY_ID: 200,
  CREATE: 400,
  UPDATE: 350,
  REMOVE: 300,
} as const;

export const applicantsHandlers: HttpHandler[] = [
  http.get(`${API_BASE_URL}/applicants`, async ({ request }) => {
    await delay(DELAY.LIST);

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') as ApplicantStatusType | null;
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder =
      (url.searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';

    let items = ApplicantsDB.getAll();

    if (search) {
      const query = search.toLowerCase();

      items = items.filter((item) =>
        item.fullName.toLowerCase().includes(query),
      );
    }

    if (status) {
      items = items.filter((item) => item.status === status);
    }

    items.sort((a, b) => {
      const key = sortBy as keyof IApplicant;
      const aVal = String(a[key] || '');
      const bVal = String(b[key] || '');
      const result = aVal.localeCompare(bVal, 'ru');

      return sortOrder === 'asc' ? result : -result;
    });

    const total = items.length;
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);

    return HttpResponse.json<IPaginatedResponse<IApplicant>>({
      data: paginated,
      total,
      page,
      limit,
    });
  }),

  http.get<{
    id: string;
  }>(`${API_BASE_URL}/applicants/:id`, async ({ params }) => {
    await delay(DELAY.GET_BY_ID);

    const applicant = ApplicantsDB.getById(Number(params.id));

    if (!applicant) {
      return HttpResponse.json(
        { error: 'Applicant not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json<IApplicant>(applicant);
  }),

  http.post(`${API_BASE_URL}/applicants`, async ({ request }) => {
    await delay(DELAY.CREATE);

    const body = (await request.json()) as Record<string, unknown>;

    if (!body.fullName) {
      return HttpResponse.json(
        { error: 'Поле fullName обязательно' },
        { status: 400 },
      );
    }

    const created = ApplicantsDB.create({
      fullName: body.fullName as string,
      phone: body.phone as string | undefined,
      status: body.status as ApplicantStatusType | undefined,
    });

    return HttpResponse.json<IApplicant>(created, { status: 201 });
  }),

  http.put<{
    id: string;
  }>(`${API_BASE_URL}/applicants/:id`, async ({ params, request }) => {
    await delay(DELAY.UPDATE);

    const body = (await request.json()) as Record<string, unknown>;
    const updated = ApplicantsDB.update(Number(params.id), {
      fullName: body.fullName as string | undefined,
      phone: body.phone as string | undefined,
      status: body.status as ApplicantStatusType | undefined,
    });

    if (!updated) {
      return HttpResponse.json(
        { error: 'Applicant not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json<IApplicant>(updated);
  }),

  http.delete<{
    id: string;
  }>(`${API_BASE_URL}/applicants/:id`, async ({ params }) => {
    await delay(DELAY.REMOVE);

    const deleted = ApplicantsDB.remove(Number(params.id));

    if (!deleted) {
      return HttpResponse.json(
        { error: 'Applicant not found' },
        { status: 404 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
