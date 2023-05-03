const BASE_URL = "http://localhost:3000/api";
export class ApiService {
  async get(path: string) {
    const response = await fetch(`${BASE_URL}${path}`);
    if (response.status >= 400 && response.status < 600) {
      throw new Error(response.statusText);
    }
    return response.json();
  }

  async post(path: string, body: any) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status >= 400 && response.status < 600) {
      throw new Error(response.statusText);
    }

    return response.json();
  }

  async put(path: string, body: any) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status >= 400 && response.status < 600) {
      throw new Error(response.statusText);
    }

    return response.json();
  }

  async delete(path: string) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 400 && response.status < 600) {
      throw new Error(response.statusText);
    }
    return response.json();
  }
}
