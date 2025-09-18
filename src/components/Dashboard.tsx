import React, { useState, useMemo, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchBooks, addBook, updateBook, deleteBook } from "../api";
import { Book } from "../types";
import BookTable from "./BookTable";
import BookForm from "./BookForm";
import { useSnackbar } from "notistack";
import FilterBar from "./FilterBar";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";

const Dashboard: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [openForm, setOpenForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);

  const [searchText, setSearchText] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  // Fetch books
  const { data: books = [], isLoading, isError } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  // Mutations
  const addMutation = useMutation<Book, Error, Book>({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      enqueueSnackbar("Book added successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to add book", { variant: "error" });
    },
  });

  const updateMutation = useMutation<Book, Error, { id: string; book: Book }>({
    mutationFn: ({ id, book }) => updateBook(id, book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      enqueueSnackbar("Book updated successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to update book", { variant: "error" });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      enqueueSnackbar("Book deleted successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to delete book", { variant: "error" });
    },
  });

  // Add/Edit handler
  const handleAddOrEdit = (book: Book) => {
    if (editingBook?._id || editingBook?.id) {
      // use `_id` if coming from crudcrud
      updateMutation.mutate({
        id: editingBook._id ?? editingBook.id!,
        book,
      });
    } else {
      addMutation.mutate(book);
    }
    setOpenForm(false);
    setEditingBook(undefined);
  };

  // Delete handler
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteMutation.mutate(id);
    }
  };

  // Normalize books so UI always uses `id`
  const normalizedBooks = useMemo(() => {
    return books.map((b: any) => ({
      ...b,
      id: b.id ?? b._id, // map crudcrud's `_id` → `id`
    }));
  }, [books]);

  // Apply filters & search
  const filteredBooks = useMemo(() => {
    return normalizedBooks
      .filter(
        (b) =>
          b.title.toLowerCase().includes(searchText.toLowerCase()) ||
          b.author.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((b) => (filterGenre ? b.genre === filterGenre : true))
      .filter((b) => (filterStatus ? b.status === filterStatus : true));
  }, [normalizedBooks, searchText, filterGenre, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Reset page if filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterGenre, filterStatus]);

  if (isLoading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Typography color="error" textAlign="center" mt={5}>
        Error fetching books 
      </Typography>
    );

  return (
    <Container
     maxWidth={false} // full width
    sx={{
      py: { xs: 2, sm: 4 },
      px: { xs: 2, sm: 4 },
      minHeight: "100vh",
      background: "linear-gradient(to right, #1e3c72, #2a5298)",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        sx={{ mb: { xs: 2, sm: 4 }, fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        📚 Book Management Dashboard
      </Typography>

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
      <FilterBar
        searchText={searchText}
        onSearchChange={setSearchText}
        filterGenre={filterGenre}
        onGenreChange={setFilterGenre}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        genres={Array.from(new Set(normalizedBooks.map((b) => b.genre)))}
        statuses={Array.from(new Set(normalizedBooks.map((b) => b.status)))}
        onAddClick={() => setOpenForm(true)}
      />

      <BookTable
        books={paginatedBooks}
        onEdit={(book) => {
          setEditingBook(book);
          setOpenForm(true);
        }}
        onDelete={handleDelete}
      />
        {/* Pagination */}
        <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev 
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "contained" : "outlined" }
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next 
          </Button>
        </Stack>
      </Paper>

      <BookForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleAddOrEdit}
        initialData={editingBook}
      />
    </Container>
  );
};

export default Dashboard;





