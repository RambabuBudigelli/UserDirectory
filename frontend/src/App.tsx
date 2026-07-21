import { Link, Route, Routes } from "react-router-dom";
import AddUser from "./pages/AddUser";
import UserList from "./pages/UserList";
import "./App.css";

function App() {
  return (
    <>
      <nav className="navbar">
        <h2>User Directory</h2>

        <div>
          <Link to="/list">List</Link>
          <Link to="/add">Add</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/list" element={<UserList />} />
        <Route path="/add" element={<AddUser />} />
      </Routes>
    </>
  );
}

export default App;