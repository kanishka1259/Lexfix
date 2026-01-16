const role = localStorage.getItem("role");
const token = localStorage.getItem("token");

if (!role || !token) {
    window.location.href = "index.html";
}

document.getElementById("roleLabel").innerText =
    "Logged in as: " + role.toUpperCase();

// Hide all panels
["teacherPanel", "studentPanel", "parentPanel"].forEach(id => {
    document.getElementById(id).style.display = "none";
});

// Show based on role
if (role === "teacher") document.getElementById("teacherPanel").style.display = "block";
if (role === "student") document.getElementById("studentPanel").style.display = "block";
if (role === "parent") document.getElementById("parentPanel").style.display = "block";

// -------- TEACHER --------
function assignTask() {
    fetch("http://127.0.0.1:5000/assign-task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            title: taskTitle.value,
            description: taskDesc.value,
            student_email: studentEmail.value
        })
    })
    .then(res => res.json())
    .then(data => teacherMsg.innerText = data.message);
}

// -------- STUDENT --------
function loadTasks() {
    fetch("http://127.0.0.1:5000/my-tasks", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(tasks => {
        taskList.innerHTML = "";
        tasks.forEach(t => {
            const li = document.createElement("li");
            li.innerText = `${t.title} - ${t.description}`;
            taskList.appendChild(li);
        });
    });
}

// -------- PARENT --------
function loadPerformance() {
    fetch("http://127.0.0.1:5000/child-performance", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            child_email: childEmail.value
        })
    })
    .then(res => res.json())
    .then(data => {
        parentTasks.innerHTML = "";
        data.tasks.forEach(t => {
            const li = document.createElement("li");
            li.innerText = `${t.title} - ${t.description}`;
            parentTasks.appendChild(li);
        });
    });
}

// -------- LOGOUT --------
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
