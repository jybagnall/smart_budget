import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="flex justify-center px-4 pt-4 pb-2 be-white">
      <div className="w-full max-w-7xl bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        <Navbar />
        <main className="px-4 sm:px-6 lg:px-8 py-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
