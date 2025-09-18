import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import { Book } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (book: Book) => void;
  initialData?: Book;
  loading?: boolean; // ✅ Add this prop
}


const BookForm: React.FC<Props> = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Book>({
    title: "",
    author: "",
    genre: "",
    year: new Date().getFullYear(),
    status: "Available",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      // ✅ Exclude _id before setting
      const { _id, ...cleanData } = initialData as any;
      setFormData(cleanData);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.author) newErrors.author = "Author is required";
    if (!formData.genre) newErrors.genre = "Genre is required";
    if (formData.year < 1900 || formData.year > new Date().getFullYear())
      newErrors.year = "Invalid year";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // ✅ Strip out `_id` just in case
    const { _id, ...cleanData } = formData as any;
    onSubmit(cleanData);

    // Reset form
    setFormData({
      title: "",
      author: "",
      genre: "",
      year: new Date().getFullYear(),
      status: "Available",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Book" : "Add Book"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            fullWidth
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            error={!!errors.author}
            helperText={errors.author}
          />
          <TextField
            fullWidth
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            error={!!errors.genre}
            helperText={errors.genre}
          />
          <TextField
            fullWidth
            type="number"
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            error={!!errors.year}
            helperText={errors.year}
          />
        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="Available">Available</MenuItem>
          <MenuItem value="Issued">Issued</MenuItem>
          <MenuItem value="Reversed">Reversed</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Returned">Returned</MenuItem>
          <MenuItem value="Lost">Lost</MenuItem>
          <MenuItem value="Damaged">Damaged</MenuItem>
          <MenuItem value="Reserved">Reserved</MenuItem>
        </TextField>

          <Button variant="contained" onClick={handleSubmit}>
            {initialData ? "Update" : "Add"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default BookForm;
