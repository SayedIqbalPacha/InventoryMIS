const API_URL = "http://localhost:9000/api/v1/sales";

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


// GET ALL sales
export async function getSales() {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}


// GET ONE Sale
export async function getOneSales(id) {

  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}


// CREATE sale
export async function createSales(saleData) {

  const token = getToken();

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(saleData),
  });

  return handleResponse(response);
}


// UPDATE Sale
export async function updateSales(id, saleData) {

  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(saleData),
  });

  return handleResponse(response);
}


// DELETE Sale
export async function deleteSales(id) {

  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}