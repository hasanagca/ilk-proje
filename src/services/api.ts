// src/services/api.ts
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export const fetchItems = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('API isteği sırasında bir hata oluştu:', error);
    throw error;
  }
};

export const addItem = async (newItem: { userId: number; title: string; body: string }) => {
  try {
    const response = await axios.post(API_URL, newItem);
    return response.data;
  } catch (error) {
    console.error('Ekleme işlemi sırasında bir hata oluştu:', error);
    throw error;
  }
};

export const updateItem = async (id: number, updatedItem: { userId: number; title: string; body: string }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedItem);
    return response.data;
  } catch (error) {
    console.error('Güncelleme işlemi sırasında bir hata oluştu:', error);
    throw error;
  }
};

export const deleteItem = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Silme işlemi sırasında bir hata oluştu:', error);
    throw error;
  }
};
