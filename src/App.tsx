import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import BookForm from "./components/BookForm";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
          {/* Dashboard page */}
          <Route path="/" element={<Dashboard />} />

          {/* Add/Edit Book page */}
          <Route
            path="/bookform"
            element={
              <BookForm
                open={true}
                onClose={() => {}}
                onSubmit={(book) => console.log(book)}
              />
            }
          />
        </Routes>
      </Router>
    </SnackbarProvider>
  </QueryClientProvider>
);

export default App;
