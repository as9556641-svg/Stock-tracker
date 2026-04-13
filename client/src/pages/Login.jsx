import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { authApi, getApiErrorMessage } from "../api/api";
import Alert from "../components/Alert";
import AuthForm from "../components/AuthForm";
import AuthShell from "../components/AuthShell";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const initialState = {
  email: "",
  password: ""
};

function Login() {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const toastMessage = location.state?.toastMessage;

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowToast(false);
      navigate(location.pathname, { replace: true, state: null });
    }, 2500);

    return () => clearTimeout(timer);
  }, [location.pathname, navigate, toastMessage]);

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
        email: formData.email.trim(),
        password: formData.password
      };

      const response = await authApi.login(payload);
      const { token: authToken, user } = response.data;

      login(authToken, user);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to login. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast isVisible={Boolean(toastMessage && showToast)} message={toastMessage || ""} />
      <AuthShell
        altLabel="Create one"
        altLink="/signup"
        altText="Don't have an account?"
        subtitle="Login to view your stocks, track your portfolio value, and manage positions in one clean dashboard."
        title="Welcome back"
      >
        {error ? <Alert message={error} /> : null}

        <div className="mt-4">
          <AuthForm
            buttonText="Login"
            fields={[
              {
                label: "Email Address",
                name: "email",
                placeholder: "you@example.com",
                type: "email"
              },
              {
                label: "Password",
                name: "password",
                placeholder: "Enter your password",
                type: "password"
              }
            ]}
            footer={
              <p className="text-center text-sm text-slate-500">
                Use the same email and password you registered with on the live app.
              </p>
            }
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
            values={formData}
          />
        </div>
      </AuthShell>
    </>
  );
}

export default Login;
