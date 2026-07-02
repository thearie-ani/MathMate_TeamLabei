export default function Avatar({ src, name = "", size = "md", className = "" }) {
  const sizes = { sm: "avatar-sm", md: "avatar-md", lg: "avatar-lg" };
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`avatar ${sizes[size] ?? ""} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="avatar-img" />
      ) : (
        <span className="avatar-initials">{initials}</span>
      )}
    </div>
  );
}
