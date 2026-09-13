const API_URL = "http://localhost:9000/api/v1/users";

// GET TOKEN
function getToken() {
  return localStorage.getItem("token");
}

// HANDLE API RESPONSE
async function handleResponse(response) {
  // 204 No Content
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(data?.message || "Something went wrong");

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

// GET ALL USERS
export async function getUsers() {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

// GET ONE USER
export async function getUser(id) {
  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

// CREATE USER
export async function createUser(userData) {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}

// UPDATE USER
export async function updateUser(id, userData) {
  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}

// DELETE / DEACTIVATE USER
export async function deleteUser(id) {
  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}
