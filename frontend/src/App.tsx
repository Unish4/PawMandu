import { Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";
import Root from "./layouts/Root";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
          success: { iconTheme: { primary: "#0f766e", secondary: "#fff" } },
        }}
      />
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
