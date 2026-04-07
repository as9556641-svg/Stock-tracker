import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import Alert from "../components/Alert";
import AuthForm from "../components/AuthForm";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";

const initialState = {
  name: "",
  email: "",
  password: ""
};

function SignupPage() {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/signup", formData);
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      altLabel="Login instead"
      altLink="/login"
      altText="Already have an account?"
      subtitle="Create your account to start managing stock positions with secure login and a beginner-friendly dashboard."
      title="Create account"
    >
      {error ? <Alert message={error} /> : null}

      <div className="mt-4">
        <AuthForm
          buttonText="Create Account"
          fields={[
            {
              label: "Full Name",
              name: "name",
              placeholder: "Ajeet Kumar",
              type: "text"
            },
            {
              label: "Email Address",
              name: "email",
              placeholder: "you@example.com",
              type: "email"
            },
            {
              label: "Password",
              name: "password",
              placeholder: "Minimum 6 characters",
              type: "password"
            }
          ]}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          values={formData}
        />
      </div>
    </AuthShell>
  );
}

export default SignupPage;
