import api from "./api";

export const getProfile = () => {
  return api.get("/profile");
};

export const updateProfile = (data) => {
  return api.put("/profile/update", data);
};

export const changePassword = (data) => {
  return api.put("/profile/password", data);
};
