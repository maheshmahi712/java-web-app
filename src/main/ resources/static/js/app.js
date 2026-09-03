const userForm = document.getElementById("userForm");
const userTableBody = document.getElementById("userTableBody");

document.addEventListener("DOMContentLoaded", loadUsers);

userForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    try {

        const response = await fetch("/api/users", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email
            })
        });

        if (!response.ok) {

            const error = await response.text();

            alert(error || "Failed to create user");

            return;
        }

        userForm.reset();

        await loadUsers();

    } catch (error) {

        console.error(error);

        alert("Server connection failed");
    }
});


async function loadUsers() {

    try {

        const response = await fetch("/api/users");

        if (!response.ok) {
            throw new Error("Failed to load users");
        }

        const users = await response.json();

        userTableBody.innerHTML = "";

        users.forEach(user => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button
                        class="delete-btn"
                        onclick="deleteUser(${user.id})">
                        Delete
                    </button>
                </td>
            `;

            userTableBody.appendChild(row);
        });

    } catch (error) {

        console.error(error);

        userTableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    Unable to load users
                </td>
            </tr>
        `;
    }
}


async function deleteUser(id) {

    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }

    try {

        const response = await fetch(`/api/users/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            alert("Failed to delete user");
            return;
        }

        await loadUsers();

    } catch (error) {

        console.error(error);

        alert("Server connection failed");
    }
}
