/**
 * HTTP-ошибка от API
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly response?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Базовая конфигурация API-клиента
 */
interface IApiClientConfig {
  baseUrl: string;
}

/**
 * Универсальный API-клиент с обработкой ошибок
 */
class ApiClient {
  private readonly baseUrl: string;

  constructor(config: IApiClientConfig) {
    this.baseUrl = config.baseUrl;
  }

  /**
   * Выполняет HTTP-запрос и парсит JSON-ответ
   * @throws {ApiError} при HTTP-ошибках
   */
  async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    // 204 No Content — пустой ответ
    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body?.error ?? `HTTP-ошибка: ${response.status}`;

      throw new ApiError(response.status, message, body);
    }

    return response.json() as Promise<T>;
  }

  async get<T>(url: string, params?: Record<string, string>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const query = searchParams ? `?${searchParams}` : '';

    return this.request<T>(`${url}${query}`);
  }

  async post<T>(url: string, body: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(url: string, body: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(url: string, body: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, {
      method: 'DELETE',
    });
  }
}

/**
 * Базовый URL API для всех запросов
 */
export const API_BASE_URL = '/api';

/**
 * Singleton API-клиент
 */
export const apiClient = new ApiClient({ baseUrl: API_BASE_URL });
