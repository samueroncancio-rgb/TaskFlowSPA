const endpointTask = "http://localhost:3000/tasks ";
export async function getTask(userid) {
    const url = userid ? `${indepointTask}?userid=${userid}`: endpointTask;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
export async function name(params) {
    
}