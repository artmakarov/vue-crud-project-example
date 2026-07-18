import type { App } from 'vue';
import type {
  RouteLocationAsRelativeGeneric,
  RouteRecordRaw,
} from 'vue-router';
import { SupportedLocale } from '../plugins';

export interface INavItem {
  route: string | RouteLocationAsRelativeGeneric;
  title: string;
  icon: string;
}

export interface IModule {
  id: string;
  locales: Record<SupportedLocale, Record<string, unknown>>;
  getRoutes: () => RouteRecordRaw[] | Promise<RouteRecordRaw[]>;
  getNavItems: () => INavItem[];
  install?: (app: App) => Promise<void> | void;
}

export interface ILoadedModule {
  id: string;
  routes: RouteRecordRaw[];
  navItems: INavItem[];
}
