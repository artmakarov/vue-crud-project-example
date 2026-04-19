import type {
  RouteLocationAsRelativeGeneric,
  RouteRecordRaw,
} from 'vue-router';
import type { ILoadedModule, IModule, INavItem } from '../types';
import { i18n } from '@/plugins';
import { defineStore } from 'pinia';
import { type App, computed, ref } from 'vue';

const modulesGlob = import.meta.glob<{ default: IModule }>(
  '@/modules/*/index.ts',
  { eager: false },
);

export const useModulesStore = defineStore('modules', () => {
  const loadedModules = ref<ILoadedModule[]>([]);
  const isModulesLoaded = ref<boolean>(false);
  const isLoadingModules = ref<boolean>(false);

  const { t, te } = i18n.global;

  const navItems = computed<INavItem[]>(() =>
    loadedModules.value.flatMap((module) =>
      module.navItems.map((navItem) => ({
        ...navItem,
        title: te(navItem.title) ? t(navItem.title) : navItem.title,
      })),
    ),
  );

  const allRoutes = computed<RouteRecordRaw[]>(() =>
    loadedModules.value.flatMap((module) => module.routes),
  );

  const defaultRoute = computed<
    string | RouteLocationAsRelativeGeneric | undefined
  >(() => loadedModules.value[0]?.routes[0]?.path);

  async function initModules(app: App): Promise<void> {
    if (isModulesLoaded.value || isLoadingModules.value) return;

    isLoadingModules.value = true;

    try {
      const modulePromises = Object.entries(modulesGlob).map<
        Promise<ILoadedModule>
      >(async ([path, importFn]) => {
        const imported = await importFn();
        const module = imported.default;

        if (!module?.id) {
          throw new Error(`Модуль из "${path}" не имеет id`);
        }

        module.install?.(app);

        return {
          id: module.id,
          routes: await module.getRoutes(),
          navItems: module.getNavItems(),
        };
      });

      const importResults = await Promise.allSettled(modulePromises);
      const successfullyLoadedModules: ILoadedModule[] = [];

      for (const importResult of importResults) {
        if (importResult.status === 'rejected') {
          console.error(
            '[ModulesStore] Ошибка при загрузке модуля:',
            importResult.reason,
          );
          continue;
        }

        successfullyLoadedModules.push(importResult.value);
      }

      loadedModules.value = successfullyLoadedModules;
      isModulesLoaded.value = true;
    } finally {
      isLoadingModules.value = false;
    }
  }

  function isModuleLoaded(moduleId: string): boolean {
    return loadedModules.value.some((module) => module.id === moduleId);
  }

  function getModule(moduleId: string): ILoadedModule | undefined {
    return loadedModules.value.find((module) => module.id === moduleId);
  }

  function getModuleRoutes(moduleId: string): RouteRecordRaw[] {
    return getModule(moduleId)?.routes ?? [];
  }

  return {
    loadedModules,
    isModulesLoaded,
    isLoadingModules,
    navItems,
    allRoutes,
    defaultRoute,
    initModules,
    isModuleLoaded,
    getModule,
    getModuleRoutes,
  };
});
