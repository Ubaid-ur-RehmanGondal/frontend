import { Navigate , Routes, Route } from "react-router-dom";
import HomePage from './pages/home/HomePage';
import BookmarksPage from './pages/bookmark';
import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LoginPage';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';

import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from "./components/common/LoadingSpinner";
import ForgotPasswordPage from "./pages/forgotpassword";
import ResetPasswordPage from "./pages/resetPassword";
import SearchPage from "./pages/search";


function App() {
  const { data:authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if(data.error) return null;
        if (!res.ok) {
          throw new Error(data.message || 'Something went wrong');
        }
        console.log("authUser", data);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    retry: false,
  });
  if (isLoading) {
      return (
        <div className="h-screen flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      );
  }
  console.log(authUser)
  return (
      <div className="flex max-w-6xl mx-auto">
        {authUser && <Sidebar />}
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/forgot-password"
            element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />}
          />
          <Route
            path="/reset-password"
            element={!authUser ? <ResetPasswordPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/bookmarks"
            element={authUser ? <BookmarksPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/search"
            element={authUser ? <SearchPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
        {authUser?._id && <RightPanel />}
        <Toaster />
      </div>
    );
}

export default App    
