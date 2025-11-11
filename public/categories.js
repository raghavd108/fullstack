// JavaScript to toggle the popup visibility
document.addEventListener("DOMContentLoaded", () => {
  const popupTrigger = document.querySelector(".popup-trigger");
  const popupContent = document.querySelector(".popup-content");
  let hideTimeout; // To store the timeout for hiding the popup

  // Show the popup when hovering over the trigger
  popupTrigger.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout); // Cancel any scheduled hiding
    popupContent.style.display = "block";
  });

  // Keep the popup visible when hovering over the popup itself
  popupContent.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout); // Cancel any scheduled hiding
    popupContent.style.display = "block";
  });

  // Schedule hiding the popup when the cursor leaves the trigger
  popupTrigger.addEventListener("mouseleave", () => {
    hideTimeout = setTimeout(() => {
      popupContent.style.display = "none";
    }, 300); // 300ms delay before hiding
  });

  // Schedule hiding the popup when the cursor leaves the popup
  popupContent.addEventListener("mouseleave", () => {
    hideTimeout = setTimeout(() => {
      popupContent.style.display = "none";
    }, 300); // 300ms delay before hiding
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const filterBtn = document.getElementById("filter-btn");
  const filterPopup = document.getElementById("filter-popup");
  const filterOverlay = document.getElementById("filter-overlay");
  const closeBtn = document.getElementById("close-filter");

  // Show the popup
  filterBtn.addEventListener("click", function () {
    filterPopup.style.display = "block";
    filterOverlay.style.display = "block";
  });

  // Hide the popup
  closeBtn.addEventListener("click", function () {
    filterPopup.style.display = "none";
    filterOverlay.style.display = "none";
  });

  // Hide the popup when clicking outside
  filterOverlay.addEventListener("click", function () {
    filterPopup.style.display = "none";
    filterOverlay.style.display = "none";
  });
});
