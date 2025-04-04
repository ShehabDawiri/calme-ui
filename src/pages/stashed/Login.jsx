import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ 
   user_email: "",
     user_password: "" ,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const fetshuser = async () => {
    let newErrors = {};
    try {
      const response = await axios.get(`http://127.0.0.1:5000/find/${formData.user_email}`);
        
       if(response.status==202){
        navigate("/login-patient/AudioTranscriber");
       }
        else{ newErrors.exsist = "the patient not  exsist ";
            setErrors(newErrors);}
      
   } catch (error) {
   
    }
  };
  

  const validateForm = () => {
    let newErrors = {};
   
    if (!formData.user_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      newErrors.user_email = "Valid user_email is required";
    }
    if (formData.user_password.length < 5) {
      newErrors.password = "Password must be at least 6 characters";
    }
   
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    if (validateForm()) {
    
      fetshuser(); } };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">email</label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your mail"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="user_password"
              autoComplete="true"
              value={formData.user_password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          {errors.exsist && <p>{errors.exsist}</p>}
          {errors.user_email && <p>{errors.user_email}</p>}
          {errors.user_password && <p>{errors.user_password}</p>}

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account patient?{" "}
         <button onClick={()=>{{navigate("/")}}}>singin</button>
        </p>
      </div>
    </div>
  );
}
