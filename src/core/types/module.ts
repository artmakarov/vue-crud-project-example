import type { App } from 'vue';
import type {
  RouteLocationAsRelativeGeneric,
  RouteRecordRaw,
} from 'vue-router';

export interface INavItem {
  route: string | RouteLocationAsRelativeGeneric;
  title: string;
  icon: string;
}

export interface IModule {
  id: string;
  getRoutes: () => RouteRecordRaw[] | Promise<RouteRecordRaw[]>;
  getNavItems: () => INavItem[];
  install?: (app: App) => void;
}

export interface ILoadedModule {
  id: string;
  routes: RouteRecordRaw[];
  navItems: INavItem[];
}
