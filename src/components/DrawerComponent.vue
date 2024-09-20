<template>
  <div v-if="drawerOpen" class="drawer">
    <div class="drawer-content">
      <button class="btn btn-secondary" @click="$emit('close-drawer')">
        Kapat
      </button>
      <form @submit.prevent="handleUpdate" class="form-group mb-4">
        <div class="mb-3">
          <label for="drawerUserId" class="form-label">Kullanıcı ID:</label>
          <input
            v-model.number="drawerUserId"
            type="number"
            class="form-control"
            id="drawerUserId"
            placeholder="Kullanıcı ID girin"
            required
          />
        </div>
        <div class="mb-3">
          <label for="drawerBaslik" class="form-label">Başlık:</label>
          <input
            v-model="drawerBaslik"
            type="text"
            class="form-control"
            id="drawerBaslik"
            placeholder="Başlığı girin"
            required
          />
        </div>
        <div class="mb-4">
          <label for="drawerIcerik" class="form-label">İçerik:</label>
          <input
            v-model="drawerIcerik"
            type="text"
            class="form-control"
            id="drawerIcerik"
            placeholder="İçeriği girin"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary">Güncelle</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";

export default defineComponent({
  props: ["userId", "title", "body", "id", "drawerOpen"],
  emits: ["update-item", "close-drawer"], // 'close-drawer' eklendi
  setup(props, { emit }) {
    const drawerUserId = ref<number>(props.userId || 0);
    const drawerBaslik = ref<string>(props?.title || "");
    const drawerIcerik = ref<string>(props?.body || "");

    const handleUpdate = () => {
      if (drawerUserId.value && drawerBaslik.value && drawerIcerik.value) {
        const updatedItem = {
          id: props?.id || null, // null kontrolü eklendi
          userId: drawerUserId.value,
          title: drawerBaslik.value,
          body: drawerIcerik.value,
        };
        emit("update-item", updatedItem);
      } else {
        alert("Kullanıcı ID, Başlık ve İçerik girilmelidir.");
      }
    };

    watch(
  () => props.drawerOpen,
  () => {
   drawerIcerik.value = props.body
   drawerBaslik.value = props.title
   drawerUserId.value = props.userId
  }
)

  
    return {
      drawerUserId,
      drawerBaslik,
      drawerIcerik,
      handleUpdate,
    };
  },
});
</script>

<style scoped>
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow-y: auto;
  padding: 1rem;
}
.drawer-content {
  flex: 1;
  margin-bottom: 3rem;
}
</style>
