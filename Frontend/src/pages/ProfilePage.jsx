import { useAuth } from "../hooks/useAuth";
import ProfileHeader from "../features/profile/ProfileHeader";
import XPProgressBar from "../features/profile/XPProgressBar";
import AchievementGrid from "../features/profile/AchievementGrid";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="page profile-page">
      <h1 className="page-title">Profile</h1>
      <ProfileHeader user={user} />
      <XPProgressBar xp={user?.xp ?? 0} nextLevel={1000} level={user?.level ?? 1} />
      <AchievementGrid achievements={user?.achievements ?? []} />
    </div>
  );
}
