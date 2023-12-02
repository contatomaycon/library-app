<template>
  <VList
    location="bottom right"
    style="cursor: pointer;"
  >
    <VListItemTitle class="font-weight-semibold">
      {{ userInfo }}
    </VListItemTitle>
      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 Logout -->
          <VListItem
            @click="handleLogout"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
  </VList>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getUser, logout } from "@/auth";

export default defineComponent({
  name: 'UserProfile',
  computed: {
    userInfo(): ReturnType<typeof getUser> {
      return getUser();
    }
  },
  methods: {
    async handleLogout() {
      await logout();
    }
  }
});
</script>
