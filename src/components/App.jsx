import { Route, Routes, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import TargetSpendingForm from "./forms/TargetSpendingForm";
import Login from "../components/Login";
import UserContext from "../contexts/UserContext";
import Homepage from "./Homepage";
import PageNotFound from "./alerts/PageNotFound";
import CategoryList from "./expenses/CategoryList";

function App() {
  const { user, loading, hasBudget } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !hasBudget) {
      navigate("/set-budgets");
    }
  }, [user, loading, hasBudget, navigate]);

  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/set-budgets" element={<TargetSpendingForm />} />

      <Route path="/category-list" element={<CategoryList />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
