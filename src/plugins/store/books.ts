import { defineStore } from 'pinia';
import axios from '@/plugins/axiosAuth';
import type { Book } from '@/common/type/Book';

export const booksStore = defineStore('booksStore', {
  state: () => {
    return {
      dataBook: [] as Book[],
      showModal: false,
      isOutlinedSnackbarVisible: false,
      snackbarMessage: '',
      snackbarColor: 'error',
    };
  },
  actions: {
    setShowModal(newVal: boolean) {
      this.showModal = newVal;
    },
    setSnackbarVisibility(visible: boolean) {
      this.isOutlinedSnackbarVisible = visible;
    },
    setSnackbarMessage(message: string) {
      this.snackbarMessage = message;
    },
    setSnackbarColor(color: string) {
      this.snackbarColor = color;
    },
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
    async listAllBooks() {
      const list = await axios.get('/book/list');

      if (list) {
        this.dataBook = list.data.map((book: Book) => ({
          ...book,
          created_at: this.formatDate(book.created_at)
        })) as Book[];
      }
    },
    async listBooks(idBook: number): Promise<Book> {
      try {
        const result = await axios.get(`book/list/${idBook}`);
    
        if (!result || !result.data) {
          return {} as Book;
        }
    
        return result.data as Book;
      } catch (error) {
        console.error("Erro ao listar livros:", error);
        return {} as Book;
      }
    },
    showSnackbar(message: string, color: string = 'error') {
      this.isOutlinedSnackbarVisible = true;
      this.snackbarMessage = message;
      this.snackbarColor = color;
    },
  }
});
