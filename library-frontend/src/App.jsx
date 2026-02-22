import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import Home from './pages/Home';
import Books from './pages/Books';
import Authors from './pages/Authors';
import Categories from './pages/Categories';
import Publishers from './pages/Publishers';
import BookBorrowing from './pages/BookBorrowing';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="books" element={<Books />} />
            <Route path="authors" element={<Authors />} />
            <Route path="categories" element={<Categories />} />
            <Route path="publishers" element={<Publishers />} />
            <Route path="borrowing" element={<BookBorrowing />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
