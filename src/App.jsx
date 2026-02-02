import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

const AppRoutes = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
                        : <Login />
                }
            />
            <Route
                path="/register"
                element={
                    isAuthenticated
                        ? <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
                        : <Register />
                }
            />

            {/* Protected Routes - USER */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['USER']}>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Protected Routes - ADMIN */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Default Redirect */}
            <Route
                path="/"
                element={
                    isAuthenticated
                        ? <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
                        : <Navigate to="/login" replace />
                }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
