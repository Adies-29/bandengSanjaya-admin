import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/protectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';

import Login from './pages/login';
import Categories from './pages/categories';
import Dashboard from './pages/Dashboard';
import Products from './pages/products';
import StoreInfo from './pages/storeInfo';
import Banners from './pages/banners';
import Features from './pages/features';
import Messages from './pages/messages';
import Blogs from './pages/blogs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/features" element={<Features />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/store-info" element={<StoreInfo />} />
            <Route path="/blogs" element={<Blogs />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/categories" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
