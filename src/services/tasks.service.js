const endpointTask = "http://localhost:3000/tasks";

export async function getTask(userId) {
    const url = userId
      ? `${endpointTask}?userId=${userId}`
      : endpointTask;

    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export async function createTask(task) {
    const response = await fetch(endpointTask, {
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(task)

    })
    return response
}
export async function getTaskById(id) {
  const response = await fetch(`${endpointTask}/${id}`);
  const data = await response.json();
  return data;
}

export async function updateTask(id, updatedData) {
    const response = await fetch(`${endpointTask}/${id}`,{
      method:"PUT",
      headers:{
        "content-type":"application/json"

      }, 
      body: JSON.stringify(updatedData)
    });
    return response;
}
export async function deleteTask(id) {
    const response = await fetch(`${endpointTask}/${id}`,{
        method:"DELETE"
    });
    return response
    
}