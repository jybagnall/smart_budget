import { Route, Routes } from "react-router-dom";

import SetBudgetForm from "./forms/SetBudgetForm";
import EditBudgetForm from "./forms/EditBudgetForm";
import Login from "../components/Login";
import Homepage from "./Homepage";
import PageNotFound from "./alerts/PageNotFound";
import CategoryList from "./expenses/CategoryList";
import ExpenseStatus from "./expenses/ExpenseStatus";
import PlanExpenses from "./expenses/PlanExpenses";
import Settings from "../components/Settings";
function App() {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/set-budgets" element={<SetBudgetForm isInitial={true} />} />
      <Route path="/edit-budgets" element={<EditBudgetForm />} />

      <Route
        path="/set-more-budgets"
        element={<SetBudgetForm isInitial={false} />}
      />

      <Route path="/expense-status" element={<ExpenseStatus />} />
      <Route path="/category-list" element={<CategoryList />} />
      <Route path="/plan-expenses" element={<PlanExpenses />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
