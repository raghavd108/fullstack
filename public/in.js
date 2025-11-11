function loadHTML(id, file) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
    })
    .catch((error) => console.error("Error loading HTML:", error));
}

// Load Navbar and Footer
loadHTML("navbar", "nav.html");
loadHTML("footer", "footer.html");
