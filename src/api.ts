import axios from "axios";
import { Book } from "./types";

// Replace with your CrudCrud endpoint
const API_BASE = "https://crudcrud.com/api/2f9207bd2a9647539eea4aaa906440b3/books";

// ✅ Utility to normalize `_id` → `id`
const normalizeBook = (b: any): Book => ({
  ...b,
  id: b._id ?? b.id, // prefer _id from crudcrud, fallback to id
});

export const fetchBooks = async (): Promise<Book[]> => {
  const res = await axios.get(API_BASE);
  return res.data.map(normalizeBook);
};

export const addBook = async (book: Omit<Book, "id">): Promise<Book> => {
  const res = await axios.post(API_BASE, book);
  return normalizeBook(res.data);
};

export const updateBook = async (id: string, updated: Book): Promise<Book> => {
  // crudcrud PUT overwrites the resource (must not include _id field)
  const { id: _, _id, ...payload } = updated;

  await axios.put(`${API_BASE}/${id}`, payload);
  return { ...updated, id };
};

export const deleteBook = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};
