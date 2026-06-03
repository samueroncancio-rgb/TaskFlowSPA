const endpointTask = "http://localhost:3000/tasks";

export async function getTask(userId) {
  try {
    const url = userId
      ? `${endpointTask}?userId=${userId}`
      : endpointTask;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching tasks");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createTask(task) {
  try {
    const response = await fetch(endpointTask, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(task)
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getTaskById(id) {
  try {
    const response = await fetch(`${endpointTask}/${id}`);
    if (!response.ok) throw new Error("Task not found");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateTask(id, updatedData) {
  try {
    const response = await fetch(`${endpointTask}/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function deleteTask(id) {
  try {
    const response = await fetch(`${endpointTask}/${id}`, {
      method: "DELETE"
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}