import { Link } from "react-router-dom";
import SignUpForm from "../features/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <SignUpForm />
      <p className="auth-switch">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </>
  );
}
