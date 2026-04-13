import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authApi, getApiErrorMessage } from "../api/api";
import Alert from "../components/Alert";
import AuthForm from "../components/AuthForm";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";

const initialState = {
  name: "",
  email: "",
  password: ""
};

function Register() {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      const response = await authApi.signup(payload);
      const { token: authToken, user } = response.data;

      login(authToken, user);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to create account. Please try again."));
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

export default Register;
