const requiredFields = ["first_name", "last_name", "email", "amount"];
const form = document.getElementById("charity-form");

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to validate a single field
const validateField = (field) => {
  const input = document.querySelector(`[name="${field}"]`);
  const errorElement = document.getElementById(`${field}-error`);
  const value = input.value.trimStart();
  const fieldName = capitalizeFirstLetter(field.replace("_", " "));

  console.log("value", value);

  if (value.startsWith("")) {
    input.value = value.trim();
  }
  if (!value) {
    input.classList.add("error");
    errorElement.textContent = `${fieldName} is required.`;
  } else if (field === "email" && !validateEmail(value)) {
    input.classList.add("error");
    errorElement.textContent = "Please enter a valid email address.";
  } else {
    input.classList.remove("error");
    errorElement.textContent = "";
  }
};

// Function to validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Add input event listeners to each required field
requiredFields.forEach((field) => {
  const input = document.querySelector(`[name="${field}"]`);
  input.addEventListener("input", () => validateField(field));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  let data = Object.fromEntries(formData);

  // Trim leading spaces from values
  data = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value.trimStart()])
  );

  // Clear previous error messages and highlights
  requiredFields.forEach((field) => {
    validateField(field);
  });

  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length) {
    return;
  }

  alert("Your donation has been submitted!");

  // Clear the form after successful submission
  form.reset();

  // Clear error highlights and messages
  requiredFields.forEach((field) => {
    const input = document.querySelector(`[name="${field}"]`);
    const errorElement = document.getElementById(`${field}-error`);
    if (input) input.classList.remove("error");
    if (errorElement) errorElement.textContent = "";
  });
});

// CSS for error highlighting
const style = document.createElement("style");
style.innerHTML = `
  .error {
    border-color: red;
  }
  .error-message {
    color: red;
    font-size: 0.9em;
  }
`;
document.head.appendChild(style);
