// PRODUCT DATABASE
const products = [
  {
    name: "Black Sunglass",
    code: "AVS101",
    price: 1200,
    category: "sunglasses",
    image: "https://via.placeholder.com/300"
  },
  {
    name: "Luxury Watch",
    code: "AVW201",
    price: 2500,
    category: "watches",
    image: "https://via.placeholder.com/300"
  },
  {
    name: "Premium Perfume",
    code: "AVP301",
    price: 1800,
    category: "perfumes",
    image: "https://via.placeholder.com/300"
  },
  {
    name: "Face Wash",
    code: "AVF401",
    price: 650,
    category: "facewash",
    image: "https://via.placeholder.com/300"
  },
  {
    name: "Gold Bracelet",
    code: "AVB501",
    price: 900,
    category: "bracelets",
    image: "https://via.placeholder.com/300"
  }
];

const container = document.getElementById("productContainer");

// DISPLAY PRODUCTS
function displayProducts(productArray){
  container.innerHTML = "";
  productArray.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}">
        <div class="product-name">${product.name}</div>
        <div>Code: ${product.code}</div>
        <div class="product-price">৳${product.price}</div>
        <button class="buy-btn" onclick="directBuy('${product.name}',${product.price})">Buy Now</button>
      </div>
    `;
  });
}

// FILTER CATEGORY
function filterCategory(category){
  if(category === "all"){
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    displayProducts(filtered);
  }
}

// SEARCH SYSTEM
function searchProduct(){
  const value = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value) ||
    p.code.toLowerCase().includes(value)
  );
  displayProducts(filtered);
}

// DIRECT BUY (WhatsApp)
function directBuy(name,price){
  const message = `🛍️ New Order - Aurvion\n\nProduct: ${name}\nPrice: ৳${price}\n\nName:\nPhone:\nAddress:\nPayment Method:\nTransaction ID (if needed):`;
  const url = `https://wa.me/8801586094280?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// LOAD ALL PRODUCTS ON START
displayProducts(products);