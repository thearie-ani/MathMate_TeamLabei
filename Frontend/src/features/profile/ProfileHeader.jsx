import Avatar from "../../components/ui/Avatar";

export default function ProfileHeader({ user }) {
  return (
    <div className="profile-header">
      <Avatar name={user?.name} size="lg" />
      <div className="profile-info">
        <h2 className="profile-name">{user?.name}</h2>
        <p className="profile-email">{user?.email}</p>
        <p className="profile-role">{user?.role}</p>
      </div>
    </div>
  );
}
