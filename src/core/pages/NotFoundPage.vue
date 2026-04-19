<template>
  <v-empty-state
    headline="404"
    :title="$t('pages.notFound.title')"
    :text="$t('pages.notFound.description', { path: $route.fullPath })"
    image="mdi-alert-circle-outline"
  >
    <template #actions>
      <v-btn
        color="primary"
        prepend-icon="mdi-home"
        variant="outlined"
        :to="{ name: 'Home' }"
      >
        {{ $t('common.backToHome') }}
      </v-btn>
    </template>
  </v-empty-state>
</template>
