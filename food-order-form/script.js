const dropdownButton = document.getElementById("dropdown-button");
const dropdownMenu = document.getElementById("dropdown-menu");
const addToCartButton = document.getElementById("add-to-cart");
const cartList = document.querySelector(".cart-list-container");
const priceTotal = document.querySelector(".price-total");
const quantityInput = document.getElementById("quantity");

const foods = [
  {
    name: "Triple Cheeseburger w/ Fries Medium Meal",
    price: 2,
    image: "./pictures/burger1.jpg",
  },
  {
    name: "1pc Chickenjoy w/ Jolly Spaghetti Solo",
    price: 5,
    image: "./pictures/chicken1.jpg",
  },
  {
    name: "Bam-i",
    price: 3,
    image: "./pictures/bam-i.jpg",
  },
  {
    name: "Vanilla Oreo Cheesecake",
    price: 3,
    image: "./pictures/oreo.jpg",
  },
  {
    name: "Creamy Spinach Dip",
    price: 4,
    image: "./pictures/spinach.jpg",
  },

  { name: "Lechon Manok", price: 8, image: "./pictures/lechonmanok1.jpg" },
];

const populateDropdownMenu = () => {
  const optionsHTML = foods
    .map((item, index) => {
      return `<div class="flex items-center p-2 cursor-pointer hover:bg-[#ffeef5]" data-index="${index}">
                <img src="${item.image}" alt="${item.name}" class="bg-[#ddd] object-cover rounded-[8px] overflow-hidden w-10 h-10 mr-2"/>
                <div>
                  <div>${item.name}</div>
                  <div class="text-[#d43378] text-[14px]">$${item.price}</div>
                </div>
              </div>`;
    })
    .join("");
  dropdownMenu.innerHTML = optionsHTML;
};

const toggleDropdown = () => {
  dropdownMenu.classList.toggle("hidden");
};

const selectFood = (event) => {
  const selectedIndex = event.currentTarget.getAttribute("data-index");
  const selectedFood = foods[selectedIndex];
  dropdownButton.textContent = selectedFood.name;
  dropdownButton.setAttribute("data-selected-index", selectedIndex);
  dropdownMenu.classList.add("hidden");
};

const addToCart = () => {
  const selectedIndex = dropdownButton.getAttribute("data-selected-index");
  if (selectedIndex === null) {
    alert("Please select a food item.");
    return;
  }
  const selectedFood = foods[selectedIndex];
  const quantity = parseInt(quantityInput.value, 10);
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const existingItemIndex = cartItems.findIndex(
    (item) => item.name === selectedFood.name
  );

  if (existingItemIndex !== -1) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    selectedFood.quantity = quantity;
    cartItems.push(selectedFood);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  alert(`${selectedFood.name} added to cart!`);
  renderCartItems();
};

const renderCartItems = () => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartItemsHTML = cartItems
    .map((item, index) => {
      return `<div class="flex items-center mb-2">
                <div class="bg-white justify-between w-full flex items-center p-[15px] rounded-[5px] shadow">
                  <div class="flex gap-[15px]">
                    <div class="w-[50px]">
                      <img src="${item.image}" alt="${item.name}" class="min-w-[50px] bg-[#ddd] overflow-hidden h-[50px] object-cover rounded-[8px]"/>
                    </div>
                    <div>
                      <div class="text-[#d43378] font-bold mb-[15px]">${item.name}</div>
                      <div><strong>Price:</strong> $${item.price}</div>
                      <div><strong>Quantity</strong>: x${item.quantity}</div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-[15px]">
                    <button class="bg-[#ffc7df] text-center text-[#d43378] hover:bg-[#e21b70] hover:text-white transition font-bold cursor-pointer select-none py-[3px] px-[10px] rounded-[5px]" data-action="increase" data-index="${index}">+</button>
                    <button class="bg-[#ffc7df] text-center text-[#d43378] hover:bg-[#e21b70] hover:text-white transition font-bold cursor-pointer select-none py-[3px] px-[10px] rounded-[5px]" data-action="decrease" data-index="${index}">-</button>
                  </div>
                </div>
              </div>`;
    })
    .join("");

  cartList.innerHTML = cartItemsHTML;

  cartList
    .querySelectorAll('button[data-action="increase"]')
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.currentTarget.getAttribute("data-index");
        cartItems[index].quantity += 1;
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        renderCartItems();
      });
    });

  cartList
    .querySelectorAll('button[data-action="decrease"]')
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.currentTarget.getAttribute("data-index");
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity -= 1;
        } else {
          cartItems.splice(index, 1);
        }
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        renderCartItems();
      });
    });

  updateTotalPrice(cartItems);
};

const updateTotalPrice = (cartItems) => {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  priceTotal.textContent = `Total: $${totalPrice}`;
};

populateDropdownMenu();
renderCartItems();

dropdownButton.addEventListener("click", toggleDropdown);
dropdownMenu.addEventListener("click", (event) => {
  const target = event.target.closest("[data-index]");
  if (target) {
    selectFood({ currentTarget: target });
  }
});
addToCartButton.addEventListener("click", addToCart);
