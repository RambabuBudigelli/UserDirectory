import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { getUsers } from "../api/userApi";

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      setError("Unable to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error">
          {error}
        </div>

        <button onClick={loadUsers}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
  <h1>User List</h1>

  <div className="table-container">
    <table className="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>City</th>
          <th>State</th>
          <th>Pincode</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.age}</td>
            <td>{user.city}</td>
            <td>{user.state}</td>
            <td>{user.pincode}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}

export default UserList;