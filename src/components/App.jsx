import { Route, Routes } from "react-router-dom";

import TargetSpendingForm from "./forms/TargetSpendingForm";
import Login from "../components/Login";
import Homepage from "./Homepage";
import PageNotFound from "./alerts/PageNotFound";
import CategoryList from "./expenses/CategoryList";
import ExpenseStatus from "./expenses/ExpenseStatus";

function App() {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/set-budgets" element={<TargetSpendingForm />} />
      <Route path="/expense-status" element={<ExpenseStatus />} />
      <Route path="/category-list" element={<CategoryList />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
