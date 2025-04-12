export const getToken = () => localStorage.getItem("icg_authToken");

export const fetchUser = async () => {
  try {
    const token = getToken();
    const res = await fetch("http://localhost:5000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to authenticate");

    return await res.json();
  } catch {
    return null;
  }
};
