const endpointUser = "http://localhost:3000/users"

export async function getUsers() {
    try {
        const response = await fetch(endpointUser);
        if (!response.ok) throw new Error("Error fetching users");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createUsers(newUser) {
    try {
        const response = await fetch(endpointUser, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(newUser)
        });
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function userById(id) {
    try {
        const response = await fetch(`${endpointUser}/${id}`);
        if (!response.ok) throw new Error("User not found");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateUser(id, updateData) {
    try {
        const response = await fetch(`${endpointUser}/${id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(updateData)
        });
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteUser(id) {
    try {
        const response = await fetch(`${endpointUser}/${id}`, {
            method: "DELETE"
        });
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}