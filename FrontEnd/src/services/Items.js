const API_URL = "http://localhost:9000/api/v1/item";

// GET TOKEN
function getToken() {
  return localStorage.getItem("token");
}


// HANDLE API RESPONSE
async function handleResponse(response) {
  
  // Your DELETE controller returns 204 No Content.
  // 204 responses do not contain JSON.
  if (response.status === 204) {
    return null;
  }

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
    ? await response.json()
    : null;


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


// GET ALL Items
export async function getItems() {

  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}


// GET ONE Item
export async function getOneItem(id) {

  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}


// CREATE Item
export async function createItem(itemData) {

  const token = getToken();

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(itemData),
  });

  return handleResponse(response);
}


// UPDATE Item
export async function updateItem(id, itemData) {

  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(itemData),
  });

  return handleResponse(response);
}


// DELETE Item
export async function deleteItem(id) {

  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}