// src/api/auth.ts

const API_BASE = "http://127.0.0.1:8000/api/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  full_name: string;
  email: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || Object.values(data)[0]);
  }

  return data;
};

export const signupUser = async (payload: SignupPayload) => {
  const res = await fetch(`${API_BASE}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || Object.values(data)[0]);
  }

  return data;
};


export const logoutUser = async () => {
  const refresh = localStorage.getItem("refresh");
  const access = localStorage.getItem("access");

  if (!refresh) {
    throw new Error("No refresh token found");
  }

  const response = await fetch(`${API_BASE}/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access}`,
    },
    body: JSON.stringify({ refresh }),
  });

  

  // If response is NOT ok → throw error
  if (!response.ok) {
    let err;
    try {
      err = await response.json();
    } catch {
      throw new Error("Logout failed");
    }
    throw new Error(err.detail || "Logout failed");
  }

  // Some backends return empty body → avoid parsing
  try {
    return await response.json();
  } catch {
    return { message: "Logged out" };
  }
};