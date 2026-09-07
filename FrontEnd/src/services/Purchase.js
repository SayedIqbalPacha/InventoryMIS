const API_URL = "http://localhost:9000/api/v1/purchase";

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


// GET ALL Purchases
export async function getPurchases() {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}


// GET ONE Purchase
export async function getOnePurchase(id) {

  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}


// CREATE Purchase
export async function createPurchase(purchaseData) {

  const token = getToken();

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(purchaseData),
  });

  return handleResponse(response);
}


// UPDATE Purchase
export async function updatePurchase(id, purchaseData) {

  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(purchaseData),
  });

  return handleResponse(response);
}


// DELETE Purchase
export async function deletePurchase(id) {

  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}