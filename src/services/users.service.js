const endpointUser = "http://localhost:3000/users "

export async function getUsers() {
    const response = await fetch(endpointUser);
    const data = await response.json();
    return data;
}

export async function createUsers(newUser) {
    const response = await fetch("http://localhost:3000/users",{
    method:"POST",
    headers:{
      "content-type": "application/json"
    },
    body:JSON.stringify(newUser)
  })
  return response;
}

export async function userById(id) {
    
}