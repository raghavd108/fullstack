document.addEventListener("DOMContentLoaded", () => {
  const dynamicContent = document.getElementById("dynamic-content");

  let isSignedIn = localStorage.getItem("loggedInUser") ? true : false;
  let userType = null;

  if (isSignedIn) {
    showVerifyBusinessStep();
  } else {
    showSignInStep();
  }

  function showSignInStep() {
    dynamicContent.innerHTML = `
            <h2>Become a Supplier</h2>
            <button id="sign-in-btn" class="supplier-form-button">Sign In</button>
          `;

    const signInBtn = document.getElementById("sign-in-btn");
    signInBtn.addEventListener("click", () => {
      localStorage.setItem("loggedInUser", JSON.stringify({ userId: "12345" }));
      isSignedIn = true;
      alert("Sign-in successful! Proceeding to verify your business.");
      showVerifyBusinessStep();
    });
  }

  function showVerifyBusinessStep() {
    dynamicContent.innerHTML = `
            <h2>Verify Your Business</h2>
            <p>Please select your supplier type:</p>
            <form id="supplier-type-form" class="supplier-form">
              <label>
                <input type="radio" name="supplierType" value="individual" required /> Individual Supplier
              </label><br />
              <label>
                <input type="radio" name="supplierType" value="business" required /> Business Supplier
              </label><br /><br />
              <button type="submit" class="supplier-form-button">Continue</button>
            </form>
          `;

    const supplierTypeForm = document.getElementById("supplier-type-form");
    supplierTypeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      userType = document.querySelector(
        "input[name='supplierType']:checked"
      ).value;
      alert(`You selected: ${userType}`);
      if (userType === "business") {
        showBusinessForm();
      } else {
        showIndividualForm();
      }
    });
  }

  function showBusinessForm() {
    dynamicContent.innerHTML = `
            <h2>Business Supplier Registration</h2>
            <form id="business-form" class="dynamic-form">
              <h3>Basic Information</h3>
              <label for="businessName">Business Name:</label>
              <input type="text" id="businessName" name="businessName" required /><br />

              <label for="contactPerson">Contact Person:</label>
              <input type="text" id="contactPerson" name="contactPerson" required /><br />

              <label for="email">Email Address:</label>
              <input type="email" id="email" name="email" required /><br />

              <label for="phone">Phone Number:</label>
              <input type="tel" id="phone" name="phone" required /><br />

              <h3>Business Details</h3>
              <label for="categories">Categories of Items to Supply:</label>
              <select id="categories" name="categories[]" multiple required>
                <option value="Party Supplies">Party Supplies</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Construction Equipment">Construction Equipment</option>
                <option value="Other">Other</option>
              </select><br />

              <label for="description">Business Description:</label>
              <textarea id="description" name="description" rows="5" required></textarea><br />

              <h3>Operational Details</h3>
              <label for="locations">Serviceable Locations:</label>
              <input type="text" id="locations" name="locations" required /><br />

              <h3>Inventory Details</h3>
              <label for="inventoryImages">Upload Images of Items:</label>
              <input type="file" id="inventoryImages" name="inventoryImages[]" multiple /><br />

              <h3>Payment Information</h3>
              <label for="bankDetails">Bank Account Details for Payments:</label>
              <textarea id="bankDetails" name="bankDetails" rows="3" required></textarea><br />

              <h3>Terms and Submission</h3>
              <label>
                <input type="checkbox" name="agreeToTerms" required />
                I agree to the terms and conditions.
              </label><br /><br />

              <button type="submit">Submit Registration</button>
            </form>
          `;

    const businessForm = document.getElementById("business-form");
    businessForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(businessForm);
      const businessData = {
        businessName: formData.get("businessName"),
        contactPerson: formData.get("contactPerson"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        categories: formData.getAll("categories[]"),
        description: formData.get("description"),
        locations: formData.get("locations"),
        inventoryImages: formData.getAll("inventoryImages[]"), // File inputs
        bankDetails: formData.get("bankDetails"),
      };

      // Prepare FormData for file uploads
      const dataToSend = new FormData();
      dataToSend.append("businessName", businessData.businessName);
      dataToSend.append("contactPerson", businessData.contactPerson);
      dataToSend.append("email", businessData.email);
      dataToSend.append("phone", businessData.phone);
      businessData.categories.forEach((category) => {
        dataToSend.append("categories[]", category);
      });
      dataToSend.append("description", businessData.description);
      dataToSend.append("locations", businessData.locations);
      businessData.inventoryImages.forEach((file) => {
        dataToSend.append("inventoryImages[]", file);
      });
      dataToSend.append("bankDetails", businessData.bankDetails);

      // Send the data using Axios
      axios
        .post("/api/businesses", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.status === 201) {
            alert("Business data saved successfully!");
            console.log("Server response:", response.data);
          } else {
            alert("Failed to save business data. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error saving business data:", error);
          alert("An error occurred. Please try again.");
        });
    });
  }

  function showIndividualForm() {
    dynamicContent.innerHTML = `
            <h2>Product Details</h2>
            <form id="product-form" class="dynamic-form">
              <label for="product-name">Product Name:</label>
              <input type="text" id="product-name" name="productName" required /><br />

              <label for="email">Email Address:</label>
              <input type="email" id="email" name="email" required /><br />

              <label for="product-description">Description:</label>
              <textarea id="product-description" name="productDescription" required></textarea><br />

              <label for="product-images">Product Images:</label>
              <input type="file" id="product-images" name="productImages" accept="image/*" multiple required /><br />

              <label for="product-price">Price:</label>
              <input type="number" id="product-price" name="productPrice" min="0" required /><br />

              <label for="product-quantity">Quantity:</label>
              <input type="number" id="product-quantity" name="productQuantity" min="1" required /><br /><br />

              <button type="submit">Save Product</button>
            </form>
          `;

    const productForm = document.getElementById("product-form");
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(productForm);
      const productData = {
        name: formData.get("productName"),
        email: formData.get("email"),
        description: formData.get("productDescription"),
        price: parseFloat(formData.get("productPrice")), // Ensure it's a number
        quantity: parseInt(formData.get("productQuantity"), 10), // Ensure it's a number
        images: formData.getAll("productImages"), // Files will be sent as FormData
      };

      // Convert productData into FormData for file upload
      const dataToSend = new FormData();
      dataToSend.append("name", productData.name);
      dataToSend.append("email", productData.email);
      dataToSend.append("description", productData.description);
      dataToSend.append("price", productData.price);
      dataToSend.append("quantity", productData.quantity);
      productData.images.forEach((file) => {
        dataToSend.append("images", file);
      });

      // Use Axios to send data to the server
      axios
        .post("/api/products", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.status === 201) {
            alert("Product saved successfully!");
            console.log("Server response:", response.data);
          } else {
            alert("Failed to save product. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error saving product:", error);
          alert("An error occurred. Please try again.");
        });
    });
  }

  function saveToDatabaseAndEmail(data) {
    console.log("Saving to database:", data);

    const userDetails = {
      userType: userType,
      userId: JSON.parse(localStorage.getItem("loggedInUser")).userId,
    };

    console.log("Sending email with details:", { userDetails, data });

    alert("Details saved successfully and emailed to the company!");
    showSupplierDashboard(data);
  }

  function showSupplierDashboard(data) {
    dynamicContent.innerHTML = `
            <h2>Supplier Dashboard</h2>
            <h3>Your Submitted Data</h3>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          `;
  }
});
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

// Placeholder for search functionality
function searchProducts() {
  const query = document.getElementById("search-bar").value;
  alert("Searching for: " + query);
}
