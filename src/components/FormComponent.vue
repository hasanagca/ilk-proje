<template>
  <form @submit.prevent="handleAdd" class="form-group mb-4" :class="{ 'disabled-form': drawerOpen }">
    <div class="mb-3">
      <label for="userId" class="form-label">Kullanıcı ID:</label>
      <input v-model.number="userId" type="number" class="form-control" id="userId" placeholder="Kullanıcı ID girin" required :disabled="drawerOpen">
    </div>
    <div class="mb-3">
      <label for="baslik" class="form-label">Başlık:</label>
      <input v-model="baslik" type="text" class="form-control" id="baslik" placeholder="Başlığı girin" required :disabled="drawerOpen">
    </div>
    <div class="mb-4">
      <label for="icerik" class="form-label">İçerik:</label>
      <input v-model="icerik" type="text" class="form-control" id="icerik" placeholder="İçeriği girin" required :disabled="drawerOpen">
    </div>
    <button type="submit" class="btn btn-primary" :disabled="drawerOpen">
      Ekle
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    drawerOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['add-item'],
  setup(props, { emit }) {
    const userId = ref<number>(0);
    const baslik = ref<string>('');
    const icerik = ref<string>('');

    const handleAdd = () => {
      if (userId.value && baslik.value && icerik.value) {
        const newItem = {
          userId: userId.value,
          title: baslik.value,
          body: icerik.value
        };
        emit('add-item', newItem); // Parent bileşene item'ı gönder
        resetForm();
      } else {
        alert('Kullanıcı ID, Başlık ve İçerik girilmelidir.');
      }
    };

    const resetForm = () => {
      userId.value = 0;
      baslik.value = '';
      icerik.value = '';
    };

    return {
      userId,
      baslik,
      icerik,
      handleAdd
    };
  }
});
</script>

<style scoped>
.disabled-form {
  pointer-events: none;
  opacity: 0.6;
}
</style>
