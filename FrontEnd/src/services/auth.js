const API_URL = "http://localhost:9000/api/v1/auth";

// HANDLE RESPONSE
async function handleResponse(response) {
  let data = null;

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Something went wrong");

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


// SIGNUP
export async function signup(userData) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}


// FORGOT PASSWORD
export async function forgotPassword(email) {
  const response = await fetch(`${API_URL}/forgotPassword`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
    }),
  });

  return handleResponse(response);
}


// RESET PASSWORD
export async function resetPassword(token, password, passwordConfirm) {
  const response = await fetch(
    `${API_URL}/resetPassword/${token}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        password,
        passwordConfirm,
      }),
    }
  );

  return handleResponse(response);
}


// UPDATE CURRENT USER
export async function updateMe(userData) {
  const token = getToken();

  const response = await fetch(`${API_URL}/updateMe`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}


// DELETE CURRENT USER
export async function deleteMe() {
  const token = getToken();

  const response = await fetch(`${API_URL}/deleteMe`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
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
    // this change the user from json string to object
    return JSON.parse(user);
  } catch {
    return null;
  }
}


// GET TOKEN
export function getToken() {
  return localStorage.getItem("token");
}


// SAVE AUTH DATA
export function saveAuthData(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.data));
}