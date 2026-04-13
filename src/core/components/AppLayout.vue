<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-app-bar elevation="1" density="compact" theme="dark" color="primary">
      <template #prepend>
        <v-app-bar-nav-icon @click="toggleSidebar"/>
      </template>

      <v-toolbar-title>Справочники</v-toolbar-title>

      <template #append>
        <v-btn
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            @click="setTheme(isDark ? 'light' : 'dark')"
        />
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="sidebarOpen">
      <v-list>
        <v-list-item
            :to="{ name: 'Applicants' }"
            title="Кандидаты"
            prepend-icon="mdi-account-group"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <slot/>
      </v-container>
    </v-main>

    <AppSnackbar/>
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../stores';
import AppSnackbar from './AppSnackbar.vue';

const globalStore = useGlobalStore();
const { isDark, sidebarOpen } = storeToRefs(globalStore);
const { toggleSidebar, setTheme } = globalStore;
</script>
