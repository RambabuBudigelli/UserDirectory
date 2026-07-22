import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { createUser } from "../services/userService";

interface FormData {
  name: string;
  age: string;
  city: string;
  state: string;
  pincode: string;
}

interface FormErrors {
  name?: string;
  age?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

function AddUser() {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isLoading: authLoading,
    getAccessTokenSilently,
    loginWithRedirect,
  } = useAuth0();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  }

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (
      formData.name.trim().length < 2 ||
      formData.name.trim().length > 100
    ) {
      newErrors.name =
        "Name must be between 2 and 100 characters.";
    }

    if (!formData.age) {
      newErrors.age = "Age is required.";
    } else {
      const age = Number(formData.age);

      if (!Number.isInteger(age) || age < 0 || age > 120) {
        newErrors.age =
          "Age must be between 0 and 120.";
      }
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required.";
    } else if (
      formData.pincode.trim().length < 4 ||
      formData.pincode.trim().length > 10
    ) {
      newErrors.pincode =
        "Pincode must be between 4 and 10 characters.";
    }

    return newErrors;
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!isAuthenticated) {
      await loginWithRedirect();
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      const accessToken =
        await getAccessTokenSilently();

      await createUser(
        {
          name: formData.name.trim(),
          age: Number(formData.age),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        accessToken
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Create user error:",
        error
      );

      setApiError(
        "Unable to create user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="page-container">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Add User</h1>

      {!isAuthenticated && (
        <div className="error">
          Please log in before adding a user.
        </div>
      )}

      {apiError && (
        <div className="error">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">
            Name:
          </label>

          <div className="input-container">
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />

            {errors.name && (
              <span className="field-error">
                {errors.name}
              </span>
            )}
          </div>
        </div>

        {/* Age */}
        <div className="form-group">
          <label htmlFor="age">
            Age:
          </label>

          <div className="input-container">
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
            />

            {errors.age && (
              <span className="field-error">
                {errors.age}
              </span>
            )}
          </div>
        </div>

        {/* City */}
        <div className="form-group">
          <label htmlFor="city">
            City:
          </label>

          <div className="input-container">
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />

            {errors.city && (
              <span className="field-error">
                {errors.city}
              </span>
            )}
          </div>
        </div>

        {/* State */}
        <div className="form-group">
          <label htmlFor="state">
            State:
          </label>

          <div className="input-container">
            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
            />

            {errors.state && (
              <span className="field-error">
                {errors.state}
              </span>
            )}
          </div>
        </div>

        {/* Pincode */}
        <div className="form-group">
          <label htmlFor="pincode">
            Pincode:
          </label>

          <div className="input-container">
            <input
              id="pincode"
              name="pincode"
              type="text"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
            />

            {errors.pincode && (
              <span className="field-error">
                {errors.pincode}
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Add User"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddUser;