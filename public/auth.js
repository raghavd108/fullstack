// Function to toggle between signup and signin forms
function toggleForm() {
  var signUpForm = document.getElementById("signupForm");
  var signInForm = document.getElementById("signInForm");

  signUpForm.style.display =
    signUpForm.style.display === "none" ? "block" : "none";
  signInForm.style.display =
    signInForm.style.display === "none" ? "block" : "none";
  document.getElementById("message").textContent = "";
}

// Function to show forgot password form
function showForgotPasswordForm() {
  document.getElementById("forgotPasswordForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("signInForm").style.display = "none";
  document.getElementById("message").textContent = "";
}

// Function to show the new password form
function showNewPasswordForm() {
  document.getElementById("forgotPasswordForm").style.display = "none";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("signInForm").style.display = "none";
  document.getElementById("setNewPasswordForm").style.display = "block";
  document.getElementById("message").textContent = "";
}

// Function to handle successful login
function handleLoginSuccess(user, token) {
  console.log("Logged in user:", user);
  showMessage("Login successful", false);

  // Store user data and token in sessionStorage
  sessionStorage.setItem("loggedInUser", JSON.stringify(user));
  sessionStorage.setItem("token", token);

  // Redirect to user dashboard
  window.location.href = "userdashboard.html";
}

// Function to handle signup form submission
document.getElementById("signUpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var email = document.getElementById("signupEmail").value;
  var password = document.getElementById("signupPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", true);
    return;
  }

  var userData = { firstName, lastName, email, password };

  axios
    .post("/signup", userData)
    .then((response) => {
      if (response.status === 201) {
        showMessage("Signup successful", false);
        handleLoginSuccess(response.data.user, response.data.token);
      } else {
        showMessage("Signup failed", true);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showMessage("Signup failed", true);
    });
});

// Function to handle signin form submission
document.getElementById("signInForm").addEventListener("submit", function (e) {
  e.preventDefault();

  var email = document.getElementById("signInEmail").value;
  var password = document.getElementById("signInPassword").value;

  var userData = { email, password };

  axios
    .post("/signin", userData)
    .then((response) => {
      if (response.status === 200) {
        var data = response.data;
        handleLoginSuccess(data.user, data.token);
      } else {
        showMessage("Login failed", true);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showMessage("Login failed", true);
    });
});

// Function to handle password reset request form submission
document
  .getElementById("passwordResetRequestForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("resetEmail").value;

    axios
      .post("/api/request-password-reset", { email: email })
      .then((response) => {
        if (response.status === 200) {
          showMessage("Reset link sent to your email", false);
        } else {
          showMessage(
            "Failed to send reset link. Please try again later.",
            true
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showMessage("Failed to send reset link. Please try again later.", true);
      });
  });

// Function to handle new password form submission
document
  .getElementById("newPasswordForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    var newPassword = document.getElementById("newPassword").value;
    var confirmNewPassword =
      document.getElementById("confirmNewPassword").value;

    if (newPassword !== confirmNewPassword) {
      showMessage("Passwords do not match.", true);
      return;
    }

    var resetToken = getResetTokenFromUrl();

    axios
      .post("/reset-password", { newPassword: newPassword, token: resetToken })
      .then((response) => {
        if (response.status === 200) {
          showMessage(
            "Password reset successful. Please log in with your new password.",
            false
          );
          showLoginForm();
        } else {
          showMessage(
            "Failed to reset password. Please try again later.",
            true
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showMessage("Failed to reset password. Please try again later.", true);
      });
  });

// Function to handle signout
function signout() {
  axios
    .post("/signout")
    .then((response) => {
      if (response.status === 200) {
        showMessage("Sign-out successful", false);
        sessionStorage.removeItem("loggedInUser");
        sessionStorage.removeItem("token");
        window.location.href = "index.html";
      } else {
        showMessage("Sign-out failed", true);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showMessage("Sign-out failed", true);
    });
}

// Function to display messages
function showMessage(message, isError) {
  var messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.style.color = isError ? "red" : "green";

  // Show the message for a second and then hide it
  setTimeout(function () {
    messageElement.textContent = "";
  }, 1000);
}

// Helper function to get reset token from URL
function getResetTokenFromUrl() {
  var params = new URLSearchParams(window.location.search);
  return params.get("token");
}

// Function to show login form
function showLoginForm() {
  document.getElementById("signInForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("forgotPasswordForm").style.display = "none";
  document.getElementById("setNewPasswordForm").style.display = "none";
  document.getElementById("message").textContent = "";
}

var loggedInUser = sessionStorage.getItem("loggedInUser");
var token = sessionStorage.getItem("token");

if (loggedInUser && token) {
  try {
    loggedInUser = JSON.parse(loggedInUser);
    if (loggedInUser && typeof loggedInUser === "object") {
      handleLoginSuccess(loggedInUser, token);
    } else {
      throw new Error("Invalid loggedInUser data");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("token");
    showLoginForm();
  }
} else {
  showLoginForm();
}
