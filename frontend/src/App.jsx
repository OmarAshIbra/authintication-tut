import { Navigate, Route, Routes } from "react-router-dom";
import { FloatingShape } from "./components/FloatingShape";
import SignupPage from "./pages/signupPage";
import LoginPage from "./pages/loginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import SetUsernamePage from "./pages/SetUsernamePage";
import { Toaster } from "react-hot-toast";
import { useAuthApi } from "./Api/authApi";
import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthApi();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};
// redirect authenticated users to home page// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthApi();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthApi();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-custom-gradient  flex justify-center items-center  relative overflow-hidden">
      <FloatingShape
        color="bg-blue-900"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-purple-800"
        size="w-48 h-48"
        top="40%"
        left="50%"
        delay={5}
      />
      <FloatingShape
        color="bg-grey-800"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignupPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <ProtectedRoute>
              <EmailVerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/set-username"
          element={
            <ProtectedRoute>
              <SetUsernamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
