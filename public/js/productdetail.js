// js/product.js

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}
function loadProductDetail() {
  const productId = getProductIdFromURL();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    document.getElementById("product-detail").innerHTML =
      "<p>Product not found.</p>";
    return;
  }

  const detailHTML = `
      <div class="product-images">
        <div class="image-carousel">
          ${product.images
            .map(
              (img, index) =>
                `<img src="${img}" alt="Product Image" class="${
                  index === 0 ? "active" : ""
                }" />`
            )
            .join("")}
        </div>
        <div class="thumbnail-images">
          ${product.thumbnails
            .map(
              (img, index) =>
                `<img src="${img}" alt="Thumbnail" data-index="${index}" />`
            )
            .join("")}
        </div>
      </div>
      <div class="product-info">
        <h1 class="product-title">${product.name}</h1>
        <p class="product-description">${product.description}</p>
        <p class="product-price">Rent: ₹${product.pricePerDay}/day</p>
        <div class="quantity-selector">
          <label for="rental-days">Rental Duration (in days):</label>
          <input type="number" id="rental-days" min="1" value="1" />
        </div>
        <div class="quantity-selector">
          <label for="quantity">Quantity:</label>
          <input type="number" id="quantity" min="1" value="1" />
        </div>
        <button class="add-to-cart" onclick='addToCart(${JSON.stringify(
          product
        )})'>Add to Rent Cart</button>
        <button class="buy-now" onclick='rentNow(${JSON.stringify(
          product
        )})'>Rent Now</button>
      </div>
      <section class="product-details">
        <h2>Product Details</h2>
        <ul>${product.details
          .map((detail) => `<li>${detail}</li>`)
          .join("")}</ul>
      </section>
    `;

  // Inject the HTML first
  document.getElementById("product-detail").innerHTML = detailHTML;

  // Then bind thumbnail click functionality
  const thumbnails = document.querySelectorAll(".thumbnail-images img");
  const bigImages = document.querySelectorAll(".image-carousel img");

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      bigImages.forEach((img) => img.classList.remove("active"));
      bigImages[index].classList.add("active");
    });
  });
}

function addToCart(product) {
  const rentalDays = parseInt(document.getElementById("rental-days").value);
  const quantity = parseInt(document.getElementById("quantity").value);
  let cart = JSON.parse(localStorage.getItem("rentCart")) || [];

  cart.push({
    id: product.id,
    name: product.name,
    pricePerDay: product.pricePerDay,
    rentalDays,
    quantity,
    image: product.images[0],
  });

  localStorage.setItem("rentCart", JSON.stringify(cart));
  alert(`${product.name} added to cart.`);
}

function rentNow(product) {
  const rentalDays = parseInt(document.getElementById("rental-days").value);
  const quantity = parseInt(document.getElementById("quantity").value);
  const total = rentalDays * quantity * product.pricePerDay;
  alert(
    `Renting ${quantity} x ${product.name} for ${rentalDays} days. Total: ₹${total}`
  );
  // Redirect to payment page
}

window.onload = loadProductDetail;
