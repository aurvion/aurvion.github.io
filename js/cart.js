let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(productId){
    const product = products.find(p => p.id === productId);
    const color = document.getElementById("color-"+productId).value;

    cart.push({...product, selectedColor: color, quantity:1});
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart!");
}

function buyNow(productId){
    const product = products.find(p => p.id === productId);
    const color = document.getElementById("color-"+productId).value;

    localStorage.setItem("buyNow", JSON.stringify({...product, selectedColor: color}));

    window.location.href = "../checkout.html";
}
function displayCart(){
    const container = document.getElementById("cart-items");
    if(!container) return;

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item,index)=>{
        total += item.price * item.quantity;

        container.innerHTML += `
        <div class="category-card">
            <img src="${item.image}" width="100%">
            <h3>${item.name}</h3>
            <p>Color: ${item.selectedColor}</p>
            <p>Price: ৳ ${item.price}</p>
            
            <div>
                <button onclick="changeQty(${index}, -1)">-</button>
                ${item.quantity}
                <button onclick="changeQty(${index}, 1)">+</button>
            </div>
            <br>
            <button onclick="removeItem(${index})">Remove</button>
        </div>
        `;
    });

    document.getElementById("total-price").innerText = "Total: " + total + " ৳";
}

function changeQty(index,change){
    cart[index].quantity += change;
    if(cart[index].quantity < 1){
        cart[index].quantity = 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function removeItem(index){
    cart.splice(index,1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function goCheckout(){
    window.location.href = "checkout.html";
}

displayCart();