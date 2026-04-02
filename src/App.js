import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Books from './pages/Books/Books';
import BookForm from './pages/Books/BookForm';
import Persons from './pages/Persons/Persons';
import PersonForm from './pages/Persons/PersonForm';
import Users from './pages/Users/Users';
import Login from './pages/Login/Login';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/books/add" element={<BookForm />} />
                  <Route path="/books/edit/:id" element={<BookForm />} />
                  <Route path="/persons" element={<Persons />} />
                  <Route path="/persons/add" element={<PersonForm />} />
                  <Route path="/persons/edit/:id" element={<PersonForm />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
