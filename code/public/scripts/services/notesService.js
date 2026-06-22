// Konfigurierbare Base URL
const BASE_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:3005";

export async function getNotes(isCompleted, sortBy, sortOrder) {
  let query = [];

  if (isCompleted !== undefined) {
    query.push(`isCompleted=${isCompleted}`);
  }
  if (sortBy) {
    query.push(`sortBy=${sortBy}`);
  }
  if (sortOrder) {
    query.push(`sortOrder=${sortOrder}`);
  }

  const queryStr = query.length > 0 ? `?${query.join("&")}` : "";

  const response = await http("GET", `/notes${queryStr}`);
  return response;
}

export async function addNote(note) {
  const response = await http("POST", "/notes", note);
  return response;
}

export async function updateNotes(updateNote) {
  const response = await http("PUT", `/notes/${updateNote._id}`, updateNote);
  return response;
}

async function http(method, path, data = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null,
  };

  try {
    console.log(`SEND: ${method} / ${url} data: ${JSON.stringify(data)}`);
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log(
      `RECEIVE: ${method} / ${url} data: ${JSON.stringify(jsonResponse)}...`
    );
    return jsonResponse;
  } catch (error) {
    console.error(`Error during HTTP request to ${url}:`, error);
    throw error;
  }
}
