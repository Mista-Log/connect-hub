// src/api/auth.ts

const API_BASE = "http://127.0.0.1:8000/api";

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
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  
  const data = await res.json();

  localStorage.setItem("user", JSON.stringify(data.user));

  if (!res.ok) {
    throw new Error(data.detail || Object.values(data)[0]);
  }

  return data;
};

export const signupUser = async (payload: SignupPayload) => {
  const res = await fetch(`${API_BASE}/auth/register/`, {
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

  const response = await fetch(`${API_BASE}/auth/logout/`, {
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

export const findUserByEmail = async (email: string) => {
  const token = localStorage.getItem("access");

  const response = await fetch(`http://127.0.0.1:8000/api/users/find/?email=${email}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("User not found");
  }

  return response.json();
};


export const createConversation = async (memberId: string) => {
  const token = localStorage.getItem("access");

  const payload = {
    member_ids: [memberId],
    is_group: false,
  };

  const response = await fetch(`${API_BASE}/conversations/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  console.log(payload)

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create conversation");
  }

  return response.json();
};

export const getUserConversations = async () => {
  const token = localStorage.getItem("access");

  const response = await fetch("http://127.0.0.1:8000/api/conversations/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return response.json();
};
