<template>
  <ul class="list-group">
    <li
      v-for="item in paginatedItems"
      :key="item.id"
      class="list-group-item d-flex justify-content-between align-items-center"
    >
      <div>
        <strong>ID:</strong> {{ item.id }} <br />
        <strong>Kullanıcı ID:</strong> {{ item.userId }} <br />
        <strong>Başlık:</strong> {{ item.title }} <br />
        <strong>İçerik:</strong> {{ item.body }}
      </div>
      <div class="btn-group">
        <button class="btn btn-primary btn-sm" @click="$emit('edit-item', item.id)" aria-label="Düzenle">Düzenle</button>
        <button class="btn btn-danger btn-sm" @click="$emit('delete-item', item.id)" aria-label="Sil">Sil</button>
      </div>
    </li>
  </ul>

  <!-- Sayfalama -->
  <nav aria-label="Sayfalar" class="mt-4">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="prevPage">Önceki</a>
      </li>
      <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
        <a class="page-link" href="#" @click.prevent="setPage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="nextPage">Sonraki</a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

// Item tipini tanımlıyoruz
interface Item {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export default defineComponent({
  props: {
    items: {
      type: Array as () => Item[], // Item[] türü olarak belirliyoruz
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    }
  },
  emits: ['edit-item', 'delete-item', 'set-page'],
  setup(props, { emit }) {
    const totalPages = computed(() => Math.ceil(props.items.length / props.itemsPerPage));
    const paginatedItems = computed(() => {
      const start = (props.currentPage - 1) * props.itemsPerPage;
      const end = start + props.itemsPerPage;
      return props.items.slice(start, end);
    });

    const prevPage = () => {
      if (props.currentPage > 1) emit('set-page', props.currentPage - 1);
    };

    const nextPage = () => {
      if (props.currentPage < totalPages.value) emit('set-page', props.currentPage + 1);
    };

    const setPage = (page: number) => {
      emit('set-page', page);
    };

    return {
      totalPages,
      paginatedItems,
      prevPage,
      nextPage,
      setPage
    };
  }
});
</script>

