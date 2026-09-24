import { Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";
import Root from "./layouts/Root";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import AccountPage from "./pages/AccountPage";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderDetailPage from "./pages/OrderDetailPage"

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

          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="account" element={<AccountPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />{" "}
          </Route>
        </Route>

        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
