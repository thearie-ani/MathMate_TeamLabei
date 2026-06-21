export default function Button({ children, onClick, type = "button", variant = "primary", disabled = false, className = "" }) {
  const base = "btn";
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "btn-danger",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] ?? ""} ${className}`}
    >
      {children}
    </button>
  );
}
