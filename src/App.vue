<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app" class="cockpit-root">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <RouterView v-slot="{ Component }">
      <Transition name="route-swap" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped>
.cockpit-root {
  min-height: 100dvh;
  background-color: var(--bg-obsidian);
  color: var(--ink-primary);
  position: relative;
}

.skip-link {
  position: fixed;
  top: -100px;
  left: 1rem;
  z-index: 9999;
  padding: 0.65rem 1.1rem;
  border-radius: 10px;
  background: var(--redline);
  color: #090B10;
  font-weight: 700;
  font-size: 0.875rem;
  text-decoration: none;
  transition: top 200ms var(--ease-out);
}

.skip-link:focus {
  top: 1rem;
}
</style>
