const API_URL = "http://localhost:9000/api/v1/auth";


// HANDLE RESPONSE

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Something went wrong"
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}


// LOGIN

export async function login(email, password) {

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  return handleResponse(response);
}


// LOGOUT

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}


// GET STORED USER

export function getCurrentUser() {

  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}


// GET TOKEN

export function getToken() {
  return localStorage.getItem("token");
}