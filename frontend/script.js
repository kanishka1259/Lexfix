let role = "student";
let token = "";

// ROLE SELECTION
function setRole(selectedRole, btn) {
    role = selectedRole;
    document.querySelectorAll(".roles button")
        .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

// TAB SWITCHING
function showLogin(btn) {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("registerBox").style.display = "none";

    document.querySelectorAll(".tabs button")
        .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

function showRegister(btn) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "block";

    document.querySelectorAll(".tabs button")
        .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

// REGISTER
function register() {
    fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: regEmail.value,
            password: regPassword.value,
            role: role
        })
    })
    .then(res => res.json())
    .then(data => {
        registerMsg.innerText = data.message || data.error;
    })
    .catch(() => {
        registerMsg.innerText = "Server error";
    });
}

// LOGIN
function login() {
    fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value,
            role: role
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", role);
            window.location.href = "dashboard.html";
        } else {
            loginMsg.innerText = data.error;
        }
    })
    .catch(() => {
        loginMsg.innerText = "Server error";
    });
}
