import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import AuthPage from './auth/AuthPage';
import { AuthProvider, useAuth } from './auth/AuthContext';

function ProtectedRoute({ children }) { const { user, checking } = useAuth(); const location = useLocation(); if (checking) return <div className="auth-loading"><span/><p>Securing your workspace...</p></div>; if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />; return children; }
function AppRoutes() { return <Routes><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/signup" element={<AuthPage mode="signup"/>}/><Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="/" element={<Navigate to="/dashboard" replace/>}/><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes>; }
export default function App() { return <BrowserRouter><AuthProvider><AppRoutes/></AuthProvider></BrowserRouter>; }