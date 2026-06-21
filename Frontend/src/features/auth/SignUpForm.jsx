import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function SignUpForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-form-title">Create Account</h2>
      {error && <p className="auth-error">{error}</p>}
      <Input id="signup-name" label="Full Name" value={form.name} onChange={set("name")} required />
      <Input id="signup-email" label="Email" type="email" value={form.email} onChange={set("email")} required />
      <Input id="signup-password" label="Password" type="password" value={form.password} onChange={set("password")} required />
      <Button type="submit" disabled={loading}>{loading ? "Creating account…" : "Sign Up"}</Button>
    </form>
  );
}
