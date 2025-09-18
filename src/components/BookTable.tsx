import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Book } from "../types";

interface BookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  editingBookId?: string | null;   // ✅ Add editing state
  deletingBookId?: string | null;  // ✅ Add deleting state
}

const BookTable: React.FC<BookTableProps> = ({
  books,
  onEdit,
  onDelete,
  editingBookId,
  deletingBookId,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "#1f2937", color: "#fff" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#fff" }}>Title</TableCell>
            <TableCell sx={{ color: "#fff" }}>Author</TableCell>
            <TableCell sx={{ color: "#fff" }}>Genre</TableCell>
            <TableCell sx={{ color: "#fff" }}>Year</TableCell>
            <TableCell sx={{ color: "#fff" }}>Status</TableCell>
            <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => {
            const isEditing = book.id === editingBookId;
            const isDeleting = book.id === deletingBookId;

            return (
              <TableRow key={book.id}>
                <TableCell sx={{ color: "#fff" }}>{book.title}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{book.author}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{book.genre}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{book.year}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{book.status}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => onEdit(book)}
                    color="primary"
                    disabled={isEditing || isDeleting} // disable while mutation running
                  >
                    {isEditing ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      <EditIcon sx={{ color: "#fff" }} />
                    )}
                  </IconButton>

                  <IconButton
                    onClick={() => book.id && onDelete(book.id)}
                    color="error"
                    disabled={isEditing || isDeleting}
                  >
                    {isDeleting ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      <DeleteIcon sx={{ color: "#fff" }} />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookTable;
