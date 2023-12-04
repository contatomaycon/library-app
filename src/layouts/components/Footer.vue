<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Library
      <VIcon
        icon="tabler-heart"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      Sistema de Biblioteca
    </span>
  </div>
</template>
