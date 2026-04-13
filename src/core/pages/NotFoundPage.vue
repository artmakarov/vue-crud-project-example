<template>
  <v-empty-state
    headline="404"
    title="Страница не найдена"
    :text="`Страница «${$route.fullPath}» не существует`"
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
