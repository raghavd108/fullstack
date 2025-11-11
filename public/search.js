document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const searchBtn = document.querySelector(".search-btn");

  searchBtn.addEventListener("click", () => {
    searchProducts();
  });

  searchBar.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      searchProducts();
    }
  });

  function searchProducts() {
    const query = searchBar.value.trim();
    if (query) {
      window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    } else {
      alert("Please enter a product name.");
    }
  }
});
