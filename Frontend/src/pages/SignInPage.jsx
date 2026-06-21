import { Link } from "react-router-dom";
import SignInForm from "../features/auth/SignInForm";

export default function SignInPage() {
  return (
    <>
      <SignInForm />
      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </>
  );
}
