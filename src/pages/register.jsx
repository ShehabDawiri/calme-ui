import { useState } from "react"
import { useNavigate } from "react-router-dom" // For navigation
import axios from "axios"

export default function Register() {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})

  const adduser = async () => {
    await axios.post(" http://127.0.0.1:5000/users", formData)
  }

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    let newErrors = {}
    if (!formData.user_name) newErrors.user_name = "Full Name is required"

    if (formData.user_password.length < 5) {
      newErrors.user_password = "Password must be at least 6 characters"
    }
    if (formData.user_password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let newErrors = {}
    if (validateForm()) {
      const response = await axios.get(
        `http://127.0.0.1:5000/user/${formData.user_email}`
      )

      if (response.status == 201) {
        adduser()
        navigate("/login-patient")
      } else {
        newErrors.exsist = "the user all ready"
        setErrors(newErrors)
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-150">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <p className="text-gray-500 text-center mb-6">Create your account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="user_password"
              value={formData.user_password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          {errors.exsist && <p>{errors.exsist}</p>}
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          {errors.user_name && <p>{errors.user_name}</p>}
          {errors.user_password && <p>{errors.user_password}</p>}

          <div className="flex ">
            <button
              type="submit"
              className=" relative  bottom-0 left-10  py-2 text-white
             bg-blue-500 rounded-lg hover:bg-blue-600 transition 
             duration-300"
            >
              Sign Up
            </button>

            <button
              onClick={() => navigate("/login-patient")}
              className=" relative  bottom-0 left-25  py-2 text-white rounded-lg hover:bg-black "
            >
              Login as patient
            </button>
            <button
              onClick={() => navigate("/login-admin")}
              className=" relative  bottom-0 left-36  "
            >
              login in as admin
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
