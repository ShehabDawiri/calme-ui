import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import {
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiArrowRight,
  FiActivity,
  FiMessageSquare,
  FiBarChart2,
} from "react-icons/fi";
import { Loader } from "../../components/ui/Loader";

const WelcomePage = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } =
    useAuth0();

  const goToHome = () => {
    window.location.href = "/admin-dashboard";
  };

  if (isLoading) {
    return <Loader />;
  }

  const FeatureCard = ({ icon, title, text }) => {
    const IconComponent = {
      "🤖": FiActivity,
      "🎙️": FiMessageSquare,
      "📊": FiBarChart2,
    }[icon];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:shadow-xl"
      >
        <div className="mb-4 text-4xl">
          {IconComponent ? (
            <IconComponent className="h-12 w-12 text-blue-600" />
          ) : (
            icon
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600">{text}</p>
      </motion.div>
    );
  };

  const TestimonialCard = ({ name, role, text, avatar }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-xl bg-white p-6 shadow hover:shadow-xl"
    >
      <div className="mb-4 flex items-center gap-4">
        <img
          src={avatar}
          alt={name}
          className="h-14 w-14 rounded-full border-2 border-white"
        />
        <div>
          <p className="font-bold text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <blockquote className="text-gray-600">“{text}”</blockquote>
    </motion.div>
  );

  const features = [
    {
      icon: "🤖",
      title: "AI Therapist Chatbot",
      text: "Engage in virtual therapy sessions with our advanced AI-based therapist.",
    },
    {
      icon: "🎙️",
      title: "Session Recordings",
      text: "Upload real therapy session recordings for processing and analysis.",
    },
    {
      icon: "📊",
      title: "Integrated Analytics",
      text: "Access transcriptions, summaries, and detailed analytics of every session.",
    },
  ];

  const testimonials = [
    {
      name: "Abedalla SK",
      role: "Patient",
      text: "Calmé’s AI therapist helped me open up and feel truly supported during my sessions.",
      avatar:
        "https://media.licdn.com/dms/image/v2/D4E35AQFm_O9qwRXUpA/profile-framedphoto-shrink_400_400/0/1726911195971",
    },
    {
      name: "Dr. Shehab Dawiri",
      role: "Therapist",
      text: "The platform streamlines session uploads and provides insightful transcriptions and analytics, making therapy more effective.",
      avatar:
        "https://media.licdn.com/dms/image/v2/D4D03AQHw_eyPeMv22g/profile-displayphoto-shrink_400_400/0/1678809959883",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-5xl font-extrabold text-gray-800">
            AI Full Stack Course &lt;&gt; Calmé
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Therapy Session Processing – Record, Analyze, and Interact with
            Therapy Sessions.
          </p>
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80"
            className="mx-auto w-full max-w-4xl rounded-2xl shadow-xl"
            alt="Therapy"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-10 text-center text-white"
        >
          {isAuthenticated ? (
            <>
              <h2 className="mb-6 text-3xl font-bold">
                Welcome back, {user?.name}!
              </h2>
              <div className="flex flex-col justify-center gap-4 md:flex-row">
                <button
                  onClick={goToHome}
                  className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 hover:shadow-lg"
                >
                  Go to Dashboard <FiArrowRight className="ml-2 inline" />
                </button>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="rounded-xl border border-white px-8 py-4 hover:border-red-500 hover:bg-red-500"
                >
                  <FiLogOut className="mr-2 inline" /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-6 text-3xl font-bold">Join Calmé Today</h2>
              <div className="flex flex-col justify-center gap-4 md:flex-row">
                <button
                  onClick={() => loginWithRedirect()}
                  className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 hover:shadow-xl"
                >
                  <FiLogIn className="mr-2 inline" /> Login
                </button>
                <button
                  onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                  className="rounded-xl border px-8 py-4 hover:bg-white hover:text-blue-600"
                >
                  <FiUserPlus className="mr-2 inline" /> Register
                </button>
              </div>
            </>
          )}
        </motion.div>

        {/* Features */}
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((f, idx) => (
            <FeatureCard key={idx} {...f} />
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((t, idx) => (
            <TestimonialCard key={idx} {...t} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-gray-600">
          <p className="mb-4 text-lg font-medium">
            Seamless module integration with clear API contracts and
            standardized data formats.
          </p>
          <div className="mb-6 flex justify-center gap-6">
            {[1011, 1027, 1045, 1056].map((id) => (
              <img
                key={id}
                src={`https://randomuser.me/api/portraits/lego/${id % 10}.jpg`}
                className="h-16 w-16 rounded-xl"
                alt={`lego-${id}`}
              />
            ))}
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} Calmé. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;
