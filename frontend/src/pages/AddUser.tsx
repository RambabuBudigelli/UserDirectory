import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (
      formData.name.trim().length < 2 ||
      formData.name.trim().length > 100
    ) {
      newErrors.name =
        "Name must be between 2 and 100 characters.";
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required.";
    } else {
      const age = Number(formData.age);

      if (!Number.isInteger(age) || age < 0 || age > 120) {
        newErrors.age =
          "Age must be between 0 and 120.";
      }
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    // Pincode validation
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

    try {
      setLoading(true);
      setApiError("");

      await createUser({
        name: formData.name.trim(),
        age: Number(formData.age),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      });

      // Redirect to List after successful creation
      navigate("/list");
    } catch (error) {
      setApiError(
        "Unable to create user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <h1>Add User</h1>

      {apiError && (
        <div className="error">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />

          {errors.name && (
            <span className="field-error">
              {errors.name}
            </span>
          )}
        </div>

        {/* Age */}
        <div className="form-group">
          <label htmlFor="age">
            Age
          </label>

          <input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
          />

          {errors.age && (
            <span className="field-error">
              {errors.age}
            </span>
          )}
        </div>

        {/* City */}
        <div className="form-group">
          <label htmlFor="city">
            City
          </label>

          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
          />

          {errors.city && (
            <span className="field-error">
              {errors.city}
            </span>
          )}
        </div>

        {/* State */}
        <div className="form-group">
          <label htmlFor="state">
            State
          </label>

          <input
            id="state"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
          />

          {errors.state && (
            <span className="field-error">
              {errors.state}
            </span>
          )}
        </div>

        {/* Pincode */}
        <div className="form-group">
          <label htmlFor="pincode">
            Pincode
          </label>

          <input
            id="pincode"
            name="pincode"
            type="text"
            value={formData.pincode}
            onChange={handleChange}
          />

          {errors.pincode && (
            <span className="field-error">
              {errors.pincode}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Add User"}
        </button>
      </form>
    </div>
  );
}

export default AddUser;