import type { ApplicantStatusType } from '../types';
import { onMounted, onUnmounted } from 'vue';
import { useApplicantsStore } from '../stores';

const INTERVAL_MS = 5000;

const statuses: ApplicantStatusType[] = ['new', 'in_work', 'done'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Имитация real-time обновлений
 * Случайным образом меняет статус кандидата каждые 5 секунд
 */
export function useRealtimeMock() {
  const store = useApplicantsStore();
  let timerId: ReturnType<typeof setInterval> | null = null;

  function stop(): void {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  onMounted(() => {
    timerId = setInterval(() => {
      const applicants = store.list;

      if (!applicants.length) return;

      const randomApplicant = randomFrom(applicants);

      store.updateApplicantInPlace(
        randomApplicant.id,
        { status: randomFrom(statuses) },
      );
    }, INTERVAL_MS);
  });

  onUnmounted(() => stop());

  return {
    stop,
  };
}
