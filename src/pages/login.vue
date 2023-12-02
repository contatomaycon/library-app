<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">

      <!-- 👉 Snackbar -->
      <VSnackbar
        v-model="isOutlinedSnackbarVisible"
        location="top end"
        variant="flat"
        :color="snackbarColor"
      >
        {{ snackbarMessage }}
      </VSnackbar>

      <!-- 👉 Top shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card pa-4"
        max-width="448"
      >
        <VCardItem class="justify-center">
          <template #prepend>
            <div class="d-flex">
              <VNodeRenderer :nodes="themeConfig.app.logo" />
            </div>
          </template>

          <VCardTitle class="font-weight-bold text-capitalize text-h5 py-1">
            {{ themeConfig.app.title }}
          </VCardTitle>
        </VCardItem>

        <VCardText class="pt-1">
          <h5 class="text-h5 mb-1">
            Seja bem-vindo à <span class="text-capitalize">{{ themeConfig.app.title }}</span>! 👋🏻
          </h5>
          <p class="mb-0">
            Faça login para a aventura começar!
          </p>
        </VCardText>

        <VCardText>
          <VForm 
            @submit="formLogin"
          >
            <VRow>
              <!-- username -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.username"
                  autofocus
                  label="Usuário"
                  type="username"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  label="Senha"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                  class="d-flex align-center justify-space-between flex-wrap mt-4 mb-4"
                >
                  Entrar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<script lang="ts">
import { VForm } from 'vuetify/components/VForm';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import axios from '@/plugins/axios';
import { saveToken, saveUser } from "@/auth";
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw';
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw';
import type { token } from "@/auth/type";

export default {
  name: 'Login',

  components: {
    VForm,
    VNodeRenderer
  },

  data() {    
    return {
      form: {
        username: '',
        password: ''
      },
      isPasswordVisible: false,
      themeConfig,
      isOutlinedSnackbarVisible: false,
      snackbarMessage: '',
      snackbarColor: 'error',
      authV1TopShape: authV1TopShape,
      authV1BottomShape: authV1BottomShape
    };
  },
  methods: {
    async formLogin(event: Event) {
      event.preventDefault();

      if (!this.validateForm()) {
        return;
      }

      try {
        const response = await this.loginRequest();

        if (response && response.data && response.data.token) {
          await this.handleSuccessfulLogin(response.data);
        } else {
          this.showSnackbar("Ocorreu um erro interno no servidor, por favor, tente mais tarde...");
        }
      } catch (error) {
        this.showSnackbar("Usuário ou senha inválido. Por favor, tente novamente...");
      }
    },

    validateForm(): boolean {
      if (!this.form.username) {
        this.showSnackbar("Usuário é um campo obrigatório");
        return false;
      }

      if (!this.form.password) {
        this.showSnackbar("Senha é um campo obrigatório");
        return false;
      }

      return true;
    },

    async loginRequest() {
      return await axios.post('/login', {
        username: this.form.username,
        password: this.form.password
      });
    },

    async handleSuccessfulLogin(data: { token: token; name: string }) {
      saveToken(data.token);
      saveUser(data.name);

      await this.$router.push({ name: 'index' });
    },

    showSnackbar(message: string) {
      this.isOutlinedSnackbarVisible = true;
      this.snackbarMessage = message;
    }
  }
}
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
