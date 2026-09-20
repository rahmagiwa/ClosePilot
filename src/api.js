const API_URL = "http://127.0.0.1:8000";

export async function runClose(month) {
  const response = await fetch(
    `${API_URL}/api/close?month=${month}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail || `Failed to run close for ${month}`
    );
  }

  return response.json();
}

export async function askAssistant(question, context) {
  const response = await fetch(`${API_URL}/api/assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      context,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail || "Failed to get an AI response."
    );
  }

  return response.json();
}