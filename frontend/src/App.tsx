import { Link, Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import UserList from "./pages/UserList";
import AddUser from "./pages/AddUser";

function App() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
    user,
  } = useAuth0();

  if (isLoading) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="logo">
            User Directory
          </h1>

          <div className="nav-links">
            <Link to="/">
              List
            </Link>

            {isAuthenticated && (
              <Link to="/add">
                Add
              </Link>
            )}

            {!isAuthenticated ? (
              <button
                className="auth-button"
                onClick={() => loginWithRedirect()}
              >
                Login
              </button>
            ) : (
              <div className="user-section">
                <span className="welcome-text">
                  Welcome, {user?.name || user?.email}
                </span>

                <button
                  className="auth-button"
                  onClick={() =>
                    logout({
                      logoutParams: {
                        returnTo: window.location.origin,
                      },
                    })
                  }
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<UserList />}
          />

          <Route
            path="/add"
            element={
              isAuthenticated ? (
                <AddUser />
              ) : (
                <div className="login-required">
                  <h2>
                    Authentication Required
                  </h2>

                  <p>
                    Please login to add a new user.
                  </p>

                  <button
                    className="auth-button"
                    onClick={() => loginWithRedirect()}
                  >
                    Login
                  </button>
                </div>
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;