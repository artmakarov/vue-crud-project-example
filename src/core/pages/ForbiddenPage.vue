<template>
  <v-empty-state
    headline="403"
    title="Страница не доступна"
    :text="`У вас нет доступа к странице «${$route.fullPath}»`"
    image="mdi-alert-circle-outline"
  >
    <template #actions>
      <v-btn
        color="primary"
        prepend-icon="mdi-home"
        variant="outlined"
        :to="{ name: 'Home' }"
      >
        На главную
      </v-btn>
    </template>
  </v-empty-state>
</template>
