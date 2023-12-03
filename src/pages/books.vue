<template>
  <VRow>
    <template v-if="loading">
      <VOverlay
        :model-value="loading"
        class="align-center justify-center overlay-on-top"
      >
        <VProgressCircular
          color="primary"
          indeterminate
          size="32"
        />
      </VOverlay>
    </template>

    <!-- 👉 Snackbar -->
    <VSnackbar
      v-model="handleIsOutlinedSnackbarVisible"
      location="top end"
      variant="flat"
      :color="handleSnackbarColor"
    >
      {{ handleSnackbarMessage }}
    </VSnackbar>

    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VCardTitle>Livros</VCardTitle>
        </VCardItem>

        <VCardText>
          <VRow>
            <VCol
              cols="4"
            >
              <VBtn 
                color="success"
                @click="addItem"
              >
                Adicionar
                <VIcon
                  end
                  icon="tabler-cloud-upload"
                />
              </VBtn>
            </VCol>

            <VCol
              cols="8"
            >
              <AppTextField
                v-model="search"
                density="compact"
                placeholder="Pesquisar"
                append-inner-icon="tabler-search"
                single-line
                hide-details
                dense
                outlined
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex align-center flex-wrap text-body-1">
          <VDataTable
            :headers="headers"
            :items="dataBook"
            :search="search"
            :items-per-page="10"
          >
            <!-- Template para a coluna 'Titulo' -->
            <template #item.title="{ item }">
              <div class="d-flex align-center">
                <VAvatar
                  size="32"
                  color="primary"
                  class="v-avatar-light-bg primary--text"
                  variant="tonal"
                >
                  <span>{{ avatarText(item.raw.title) }}</span>
                </VAvatar>
                <div class="d-flex flex-column ms-3">
                  <span class="d-block font-weight-medium text--primary text-truncate">{{ item.raw.title }}</span>
                  <small>{{ item.raw.post }}</small>
                </div>
              </div>
            </template>

            <!-- Template para a coluna 'Opções' -->
            <template #item.option="{ item }">
              <div class="d-flex">
                <!-- Botão Editar -->
                <VBtn
                  size="25"
                  icon
                  @click="editItem(item)"
                  color="warning"
                  class="mr-1"
                >
                  <VIcon
                    icon="mdi-pencil"
                    size="15"
                  />
                </VBtn>

                <!-- Botão Deletar -->
                <VBtn
                  size="25"
                  icon
                  @click="deleteItem(item)"
                  color="error"
                >
                  <VIcon
                    icon="mdi-delete"
                    size="15"
                  />
                </VBtn>
              </div>
            </template>

          </VDataTable>
       </VCardText>
      </VCard>
    </VCol>

    <ModalBook 
      v-if="handleShowModal" 
      :selected-book="selectedBook" 
    />
  </VRow>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { avatarText } from '@/@core/utils/formatters';
import axios from '@/plugins/axiosAuth';
import { booksStore } from '@/plugins/store/books';
import ModalBook from '@/pages/modalBook.vue';
import { mapActions, mapState } from 'pinia';
import Swal from 'sweetalert2';
import type { Book } from '@/common/type/Book';

interface DataTableItem<T> {
  raw: T
}

export default defineComponent({
  name: 'Books',
  components: {
    VDataTable,
    ModalBook
  },
  data() {
    return {
      search: '',
      selectedBook: {} as Book,
      headers: [
        { title: 'TITULO', key: 'title' },
        { title: 'DESCRICAO', key: 'description' },
        { title: 'AUTOR', key: 'author' },
        { title: 'PAGINAS', key: 'pages' },
        { title: 'DATA', key: 'created_at' },
        { title: 'OPCOES', key: 'option' }
      ]
    };
  },
  computed: {
    ...mapState(booksStore, [
      "dataBook",
      "showModal",
      "loading",
      "isOutlinedSnackbarVisible",
      "snackbarMessage",
      "snackbarColor"
    ]),
    handleShowModal: {
      get() {
        return this.showModal;
      },
      set(value: boolean) {
        return this.setShowModal(value);
      }
    },
    handleIsOutlinedSnackbarVisible: {
      get() {
        return this.isOutlinedSnackbarVisible;
      },
      set(value: boolean) {
        return this.setSnackbarVisibility(value);
      }
    },
    handleSnackbarMessage: {
      get() {
        return this.snackbarMessage;
      },
      set(value: string) {
        return this.setSnackbarMessage(value);
      }
    },
    handleSnackbarColor: {
      get() {
        return this.snackbarColor;
      },
      set(value: string) {
        return this.setSnackbarColor(value);
      }
    }
  },
  methods: {
    ...mapActions(booksStore, [
      "setShowModal",
      "setSnackbarVisibility",
      "setSnackbarMessage",
      "setSnackbarColor",
      "listBooks",
      "listAllBooks",
      "showSnackbar"
    ]),

    avatarText(title: string): string {
      return title 
        ? title.replace(/\s+/g, '').substring(0, 2).toUpperCase() 
        : '';
    },

    removeBookFromList(bookId: string) {
      const index = this.dataBook.findIndex(book => book.id === bookId);
      if (index !== -1) {
        this.dataBook.splice(index, 1);
      }
    },

    async addItem() {
      this.selectedBook = {} as Book;
      this.handleShowModal = true;
    },

    async editItem(item: DataTableItem<Book>) {
      this.selectedBook = await this.listBooks(Number(item.raw.id));

      this.handleShowModal = true;
    },

    async deleteItem(item: DataTableItem<Book>) {
      const confirmation = await Swal.fire({
        title: 'Tem certeza que deseja deletar?',
        text: 'Esta ação não pode ser revertida!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        customClass: {
          confirmButton: "v-theme--light bg-error"
        },
      });

      if (confirmation.isConfirmed) {
        try {
          const result = await axios.delete(`/book/delete/${item.raw.id}`);

          if (result) {
            this.removeBookFromList(item.raw.id);
            this.showSnackbar('Livro deletado com sucesso', 'success');
          }
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            this.showSnackbar('Livro não existe', 'warning');
          } else {
            this.showSnackbar('Ocorreu um erro ao deletar o livro');
          }
        }
      }
    }  
  },
  async mounted() {
    await this.listAllBooks();
  },
});
</script>
