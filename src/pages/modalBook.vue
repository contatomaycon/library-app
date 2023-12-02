<template>
  <VDialog
    v-model="handleShowModal"
    max-width="600"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="handleShowModal = !handleShowModal" />

    <!-- Dialog Content -->
    <VCard :title="idBook ? 'Editar Livro' : 'Adicionar Livro'">
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="12"
            md="12"
          >
            <AppTextField
              v-model="title"
              label="Título"
            />
          </VCol>

          <VCol
            cols="12"
            sm="12"
            md="12"
          >
            <AppTextField
              v-model="author"
              label="Autor"
            />
          </VCol>

          <VCol
            cols="12"
            sm="12"
            md="12"
          >
            <AppTextField
              v-model="pages"
              label="Total de Páginas"
            />
          </VCol>

          <VCol
            cols="12"
            sm="12"
            md="12"
          >
            <AppTextarea
              v-model="description"
              clearable
              clear-icon="tabler-circle-x"
              label="Descrição"
            />
          </VCol>

        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="handleShowModal = false"
        >
          Fechar
        </VBtn>
        <VBtn @click="processBook">
          Salvar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { booksStore } from '@/plugins/store/books';
import axios from '@/plugins/axiosAuth';
import { mapActions, mapState } from 'pinia';
import type { Book } from '@/common/type/Book';

export default defineComponent({
  name: 'ModalBook',
  data() {
    return {
      idBook: '',
      title: '',
      author: '',
      pages: '',
      description: ''
    };
  },
  props: {
    selectedBook: {
      type: Object,
      default: () => (
        {} as Book
      )
    }
  },
  computed: {
    ...mapState(booksStore, [
      "dataBook",
      "showModal",
    ]),
    
    handleShowModal: {
      get() {
        return this.showModal;
      },
      set(value: boolean) {
        return this.setShowModal(value);
      }
    }
  },
  watch: {
    selectedBook: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.idBook = newVal.id;
          this.title = newVal.title;
          this.author = newVal.author;
          this.pages = newVal.pages;
          this.description = newVal.description;
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(booksStore, [
      "setShowModal",
      "listAllBooks",
      "showSnackbar",
    ]),

    async processBook() {
      if (this.idBook) {
        await this.updateBook();
      } else {
        await this.saveBook();
      }
    },

    async saveBook() {
      try {
        const payload = {
          title: this.title,
          description: this.description,
          author: this.author,
          pages: this.pages
        } as Book;

        if (!this.validateForm(payload)) {
          return;
        }

        const result = await axios.post('/book/add', payload);

        if (result) {
          this.showSnackbar('Livro adicionado com sucesso', 'success');

          await this.listAllBooks();

          this.handleShowModal = false;
        }
      } catch (error: any) {
        if (error.response && error.response.status === 409) {
          this.showSnackbar('Já existe um livro cadastrado para este título', 'warning');
        } else {
          this.showSnackbar('Ocorreu um erro ao adicionar o livro');
        }
      }
    },

    async updateBook() {
      try {
        const payload = {
          id: this.idBook,
          title: this.title,
          description: this.description,
          author: this.author,
          pages: this.pages
        } as Book;

        if (!this.validateForm(payload)) {
          return;
        }

        if (!this.idBook) {
          this.showSnackbar('Ocorreu um erro ao atualizar o livro');

          return;
        }

        const result = await axios.put('/book/list', payload);

        if (result) {
          this.showSnackbar('Livro atualizado com sucesso', 'success');

          await this.listAllBooks();

          this.handleShowModal = false;
        }
      } catch (error: any) {
        this.showSnackbar('Ocorreu um erro ao salvar o livro');
      }
    },

    validateForm(payload: Book): boolean {
      const fields: { key: keyof Book, message: string }[] = [
        { key: 'title', message: 'Título é um campo obrigatório' },
        { key: 'author', message: 'Autor é um campo obrigatório' },
        { key: 'pages', message: 'Total de Páginas é um campo obrigatório' },
        { key: 'description', message: 'Descrição é um campo obrigatório' }
      ];

      for (const { key, message } of fields) {
        if (!payload[key]) {
          this.showSnackbar(message);
          return false;
        }

        if (key === 'pages' && !/^\d+$/.test(payload[key])) {
          this.showSnackbar('Total de Páginas deve conter apenas números');
          return false;
        }
      }

      return true;
    }

  }
});
</script>
