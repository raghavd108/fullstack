// Image carousel functionality
const images = document.querySelectorAll(".image-carousel img");
const thumbnails = document.querySelectorAll(".thumbnail-images img");

thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", function () {
    images.forEach((img) => img.classList.remove("active"));
    thumbnails.forEach((thumbnail) => thumbnail.classList.remove("active"));

    thumbnail.classList.add("active");
    images[index].classList.add("active");
  });
});

images[0].classList.add("active");
thumbnails[0].classList.add("active");

// Fetching product ID
const productId = document
  .querySelector(".product-detail-container")
  .getAttribute("data-product-id");

// Fetch and display reviews
// Fetch and display reviews based on product ID
async function fetchReviews(productId) {
  const response = await fetch(`/api/reviews/${productId}`);
  const reviews = await response.json();

  const reviewSection = document.getElementById("review-section");
  reviewSection.innerHTML = `<h2>Customer Reviews</h2>`;

  reviews.forEach((review) => {
    reviewSection.innerHTML += `
            <div class="review">
              <p><strong>${review.userName}:</strong> ${review.text}</p>
              <span>Rating: ${"★".repeat(review.rating)}${"☆".repeat(
      5 - review.rating
    )}</span>
            </div>
          `;
  });
}

// Submit a review
async function submitReview(event, productId) {
  event.preventDefault();
  const userName = sessionStorage.getItem("firstName"); // Fetch user name from local storage
  if (!userName) {
    alert("Please log in to submit a review.");
    return;
  }

  const text = document.getElementById("reviewText").value.trim();
  const rating = parseInt(document.getElementById("rating").value, 10);

  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, userName, text, rating }),
  });

  if (response.ok) {
    fetchReviews(productId); // Reload reviews
    alert("Review added successfully!");
  } else {
    alert("Failed to add review");
  }
}

// Delete a review
async function deleteReview(reviewId) {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    fetchReviews(productId); // Reload reviews
    alert("Review deleted successfully!");
  } else {
    alert("Failed to delete review");
  }
}

// Initial call to fetch reviews
fetchReviews(productId);
