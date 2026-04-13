/* eslint-disable @typescript-eslint/naming-convention */
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}
