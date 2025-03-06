import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";

import TargetSpendingForm from "./forms/TargetSpendingForm";
import Login from "../components/Login";
import UserContext from "../contexts/UserContext";
import Homepage from "./Homepage";

function App() {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route
        path="/budget"
        element={user ? <TargetSpendingForm /> : <Navigate to="/login" />}
      />
      <Route index element={<Homepage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
