async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || 'The request failed. Please try again.');
    error.fields = payload.errors;
    throw error;
  }
  return payload;
}

export const taskApi = {
  list: () => request('/api/tasks'),
  create: (task) => request('/api/tasks', { method: 'POST', body: JSON.stringify(task) }),
  update: (id, task) => request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  remove: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' })
};
