import { delay, getStoredProfile, setStoredProfile } from "./mockApi";

export const getProfile = async () => delay({ data: getStoredProfile() });

export const updateProfile = async (data) => {
  const updated = setStoredProfile(data);
  return delay({ data: updated });
};
