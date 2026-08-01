import api from "./api";

export const createScan = (website) => {
  return api.post("/scans", {
    website,
  });
};

export const getScans = () => {
  return api.get("/scans");
};

export const getScan = (id) => {
  return api.get(`/scans/${id}`);
};

export const getDashboard = () => {
  return api.get("/dashboard");
};

export const deleteScan = (id) => {
  return api.delete(`/scans/${id}`);
};
