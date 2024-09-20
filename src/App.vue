<template>
  <div class="container mt-5">
    <h1 class="text-center">Form İşlemleri</h1>

    <!-- Form -->
    <form
      @submit.prevent="handleAdd"
      class="form-group mb-4"
      :class="{ 'disabled-form': drawerOpen }"
    >
      <div class="mb-3">
        <label for="userId" class="form-label">Kullanıcı ID:</label>
        <input
          v-model.number="userId"
          type="number"
          class="form-control"
          id="userId"
          placeholder="Kullanıcı ID girin"
          required
          :disabled="drawerOpen"
        />
      </div>
      <div class="mb-3">
        <label for="baslik" class="form-label">Başlık:</label>
        <input
          v-model="baslik"
          type="text"
          class="form-control"
          id="baslik"
          placeholder="Başlığı girin"
          required
          :disabled="drawerOpen"
        />
      </div>
      <div class="mb-4">
        <label for="icerik" class="form-label">İçerik:</label>
        <input
          v-model="icerik"
          type="text"
          class="form-control"
          id="icerik"
          placeholder="İçeriği girin"
          required
          :disabled="drawerOpen"
        />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="drawerOpen">
        Ekle
      </button>
    </form>

    <!-- Arama -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="Başlık, içerik veya ID ara"
        aria-label="Arama"
        :disabled="drawerOpen"
      />
    </div>

    <!-- Yükleniyor durumu -->
    <div v-if="isLoading" class="text-center">
      <span>Veriler yükleniyor...</span>
    </div>

    <!-- Listeleme -->
    <div>
      <h2 class="text-center">Liste</h2>
      <ul class="list-group">
        <li
          v-for="item in paginatedItems"
          :key="item.id"
          class="list-group-item d-flex justify-content-between align-items-center my-3 border"
        >
          <div class="p-3">
            <strong>ID:</strong> {{ item.id }} <br />
            <strong>Kullanıcı ID:</strong> {{ item.userId }} <br />
            <strong>Başlık:</strong> {{ item.title }} <br />
            <strong>İçerik:</strong> {{ item.body }}
          </div>
          <div class="btn-group">
            <button
              class="btn btn-primary btn-sm"
              @click="openDrawer(item.id)"
              aria-label="Düzenle"
            >
              Düzenle
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="handleDeleteItem(item.id)"
              aria-label="Sil"
            >
              Sil
            </button>
          </div>
        </li>
      </ul>

      <!-- Sayfalama -->
      <div class="mt-4">
        <nav aria-label="Sayfalar">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="prevPage">Önceki</a>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="setPage(page)">
                {{ page }}
              </a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <a class="page-link" href="#" @click.prevent="nextPage"
                >Sonraki</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <DrawerComponent
      :drawerOpen="drawerOpen"
      :userId="drawerUserId"
      :title="drawerBaslik"
      :body="drawerIcerik"
      :id="selectedItemId"
      @close-drawer="closeDrawer"
      @update-item="test"
    />
    <!-- Drawer -->
    <!-- <div v-if="false" class="drawer">
      <div class="drawer-content">
        <button class="btn btn-secondary" @click="closeDrawer">Kapat</button>
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
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import DrawerComponent from "@/components/DrawerComponent.vue";
import axios from "axios";

export default defineComponent({
  components: { DrawerComponent },
  setup() {
    const userId = ref<number>(0);
    const baslik = ref<string>("");
    const icerik = ref<string>("");
    const searchQuery = ref<string>("");

    const items = ref<
      Array<{ id: number; userId: number; title: string; body: string }>
    >([]);
    const selectedItemId = ref<number | null>(null);
    const drawerOpen = ref<boolean>(false);
    const drawerUserId = ref<number>(0);
    const drawerBaslik = ref<string>("");
    const drawerIcerik = ref<string>("");
    const currentPage = ref<number>(1);
    const itemsPerPage = 10;
    const isLoading = ref(false);

    const fetchItems = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        items.value = response.data;
      } catch (error) {
        console.error("API isteği sırasında bir hata oluştu:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const filteredItems = computed(() => {
      if (!searchQuery.value) return items.value;
      const query = searchQuery.value.toLowerCase();
      return items.value.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.body.toLowerCase().includes(query) ||
          item.id.toString().includes(query) ||
          item.userId.toString().includes(query)
      );
    });

    const totalPages = computed(() =>
      Math.ceil(filteredItems.value.length / itemsPerPage)
    );
    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredItems.value.slice(start, end);
    });

    const resetForm = () => {
      userId.value = 0;
      baslik.value = "";
      icerik.value = "";
      drawerUserId.value = 0;
      drawerBaslik.value = "";
      drawerIcerik.value = "";
    };

    const handleAdd = async () => {
      if (userId.value && baslik.value && icerik.value) {
        try {
          const newItem = {
            id: getNextId(),
            userId: userId.value,
            title: baslik.value,
            body: icerik.value,
          };
          await axios.post(
            "https://jsonplaceholder.typicode.com/posts",
            newItem
          );
          items.value.push(newItem);
          console.log("Ekleme işlemi başarıyla tamamlandı");
        } catch (error) {
          console.error("Ekleme işlemi sırasında bir hata oluştu:", error);
        }
        resetForm(); // Formu temizle
      } else {
        alert("Kullanıcı ID, Başlık ve İçerik girilmelidir.");
      }
    };

    const handleUpdate = async () => {
      if (drawerUserId.value && drawerBaslik.value && drawerIcerik.value) {
        try {
          const updatedItem = {
            id: selectedItemId.value!,
            userId: drawerUserId.value,
            title: drawerBaslik.value,
            body: drawerIcerik.value,
          };
          await axios.put(
            `https://jsonplaceholder.typicode.com/posts/${selectedItemId.value}`,
            updatedItem
          );
          const index = items.value.findIndex(
            (item) => item.id === selectedItemId.value
          );
          if (index !== -1) {
            items.value[index] = { ...items.value[index], ...updatedItem };
          }
          console.log("Güncelleme işlemi başarıyla tamamlandı");
          closeDrawer(); // Drawer'ı kapat ve formu temizle
          resetForm();
        } catch (error) {
          console.error("Güncelleme işlemi sırasında bir hata oluştu:", error);
        }
      } else {
        alert("Kullanıcı ID, Başlık ve İçerik girilmelidir.");
      }
    };

    const handleDeleteItem = async (id: number) => {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
        items.value = items.value.filter((item) => item.id !== id);
alert("silindi")
      } catch (error) {
        console.error("Silme işlemi sırasında bir hata oluştu:", error);
      }
    };

    const openDrawer = async (id: number) => {
      const item = items.value.find((item) => item.id === id);
      if (item) {
        drawerUserId.value = item.userId;
        drawerBaslik.value = item.title;
        drawerIcerik.value = item.body;
        selectedItemId.value = id;
        drawerOpen.value = true;
      }
    };

    // const formModel = computed(() => {
    //   userId: drawerUserId.value;
    //   title: drawerBaslik.value;
    //   body: drawerIcerik.value;
    // });

    const closeDrawer = () => {
      drawerOpen.value = false;
      resetForm(); // Formu temizle
    };

    const getNextId = (): number => {
      const maxId = items.value.reduce(
        (max, item) => Math.max(max, item.id),
        0
      );
      return maxId + 1;
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const setPage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const test = (val:any) => {
      console.log(val);
    };

    onMounted(fetchItems);

    return {
      userId,
      baslik,
      icerik,
      searchQuery,
      items,
      selectedItemId,
      drawerOpen,
      drawerUserId,
      drawerBaslik,
      drawerIcerik,
      currentPage,
      itemsPerPage,
      isLoading,
      filteredItems,
      paginatedItems,
      totalPages,
      handleAdd,
      handleUpdate,
      handleDeleteItem,
      openDrawer,
      closeDrawer,
      prevPage,
      nextPage,
      setPage,
      // formModel,
      test,
    };
  },
});
</script>

<style scoped>
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.drawer-content {
  flex: 1;
  margin-bottom: 3rem;
}
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #ddd;
}
.drawer-footer button {
  margin-left: 0.5rem;
}
.disabled-form {
  pointer-events: none;
  opacity: 0.6;
}
</style>
