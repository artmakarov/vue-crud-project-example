<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-app-bar elevation="1" density="compact" theme="dark" color="primary">
      <template #prepend>
        <v-app-bar-nav-icon @click="toggleSidebar" />
      </template>

      <v-toolbar-title>{{ $t('layout.title') }}</v-toolbar-title>

      <template #append>
        <v-btn
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          :title="$t('layout.themeToggle')"
          @click="setTheme(isDark ? 'light' : 'dark')"
        />

        <v-select
          v-model="currentLocale"
          :items="localeOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
          density="compact"
          class="mx-2"
          hide-details
        />
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="sidebarOpen">
      <div
        v-if="isLoadingModules"
        class="d-flex align-center justify-center text-center py-5"
      >
        <v-progress-circular indeterminate size="20" />
        <span class="ms-2">{{ $t('common.loading') }}</span>
      </div>

      <v-list v-else>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :to="item.route"
          :title="item.title"
          :prepend-icon="item.icon"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>

    <AppSnackbar />
  </v-app>
</template>

<script setup lang="ts">
import { setLocale, type SupportedLocale, supportedLocales } from '@/plugins';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalStore, useModulesStore } from '../stores';
import AppSnackbar from './AppSnackbar.vue';

const globalStore = useGlobalStore();
const { isDark, sidebarOpen } = storeToRefs(globalStore);
const { toggleSidebar, setTheme } = globalStore;

const modulesStore = useModulesStore();
const { isLoadingModules, navItems } = storeToRefs(modulesStore);

const { locale } = useI18n();

const localeOptions = supportedLocales.map((value) => ({
  value,
  title: value,
}));

const currentLocale = computed<SupportedLocale>({
  get: () => locale.value as SupportedLocale,
  set: (value) => setLocale(value),
});
</script>
