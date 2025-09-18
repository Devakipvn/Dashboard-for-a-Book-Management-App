

export interface Book {
  id?: string;   // normalized id (for UI)
  _id?: string;  // raw crudcrud id (optional, only when coming from API)
  title: string;
  author: string;
  genre: string;
  status: string;
  year: number ;
}