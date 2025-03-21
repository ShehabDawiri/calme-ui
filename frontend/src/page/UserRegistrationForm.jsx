import { useState } from "react";

export default function UserRegistrationForm() {
    const [data, s] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    acceptTerms: false,
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }; 
 


  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid Email is required";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.gender) newErrors.gender = "Please select a gender";
    if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmittedData(formData);
      s([...data,formData]);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        acceptTerms: false,
      });
      setErrors({});
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
          {errors.fullName && <p>{errors.fullName}</p>}
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p>{errors.password}</p>}
        </div>

        <div>
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>

        <div>
          <label>Gender:</label>
          <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} /> Male
          <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} /> Female
          {errors.gender && <p>{errors.gender}</p>}
        </div>

        <div>
          <label>
            <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} /> Accept Terms
          </label>
          {errors.acceptTerms && <p>{errors.acceptTerms}</p>}
        </div>

        <button type="submit">Register</button>
      </form>

      
      {data.length > 0 && (
        <div>
          <h3>Registered Users</h3>
          <ul>
            {data.map((user) => (
              <li >
                <strong>{user.fullName}</strong> - {user.email} - {user.gender} - Accepted Terms: {user.acceptTerms ? "Yes" : "No"}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      
    </div>
  );
}
