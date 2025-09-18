import React from "react";
import {
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";


interface FilterBarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  filterGenre: string;
  onGenreChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  genres: string[];
  statuses: string[];
  onAddClick: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchText,
  onSearchChange,
  filterGenre,
  onGenreChange,
  filterStatus,
  onStatusChange,
  genres,
  statuses,
  onAddClick,
}) => {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search by Title or Author"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        variant="outlined"
      />

      {/* Genre Filter */}
      <TextField
        select
        label="Filter Genre"
        value={filterGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        size="small"
      >
        <MenuItem value="">All Genres</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre} value={genre}>
            {genre}
          </MenuItem>
        ))}
      </TextField>

      {/* Status Filter */}
      <TextField
        select
        label="Filter Status"
        value={filterStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        size="small"
      >
        <MenuItem value="">All Status</MenuItem>
        {statuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        color="primary"
        onClick={onAddClick}
      >
        Add Book
      </Button>
    </Stack>
  );
};

export default FilterBar;
