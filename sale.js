
//模拟一些产品数据，这里也可以使用ajax从后端获取数据
const productsData = [
    {
        id: '001',
        brand: "op",
        name: "商品1",
        model: "XXX",
        stock: 10,
        price: 100,
    },
    {
        id: '002',
        brand: "np",
        name: "商品2",
        model: "YYY",
        stock: 5,
        price: 200,
    },
    {
        id: '003',
        brand: "zp",
        name: "商品3",
        model: "ZZZ",
        stock: 3,
        price: 300,
    },
];

// 获取产品容器
const productContainer = document.getElementById("product-ontainer");
// 动态！！生成卡片
productsData.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");

    const brandElement = document.createElement("h2");
    brandElement.textContent = "品牌名称：" + product.brand;
    productElement.appendChild(brandElement);
    // alert(brandElement.textContent);

    const nameElement = document.createElement("p");
    nameElement.textContent = "商品名称：" + product.name;
    productElement.appendChild(nameElement);

    const modelElement = document.createElement("p");
    modelElement.textContent = "型号：" + product.model;
    productElement.appendChild(modelElement);

    const stockElement = document.createElement("p");
    stockElement.textContent = "库存数量：" + product.stock;
    productElement.appendChild(stockElement);

    const priceElement = document.createElement("p");
    priceElement.textContent = "单价：" + product.price;
    productElement.appendChild(priceElement);

    const quantityLabel = document.createElement("label");
    quantityLabel.setAttribute("for", `quantity-${product.id}`);
    quantityLabel.textContent = "订购数量：";
    productElement.appendChild(quantityLabel);

    const quantityInput = document.createElement("input");
    quantityInput.setAttribute("type", "number");
    quantityInput.setAttribute("id", `quantity-${product.id}`);
    quantityInput.setAttribute("name", "quantity");
    quantityInput.setAttribute("min", "1");
    quantityInput.setAttribute("max", product.stock);
    quantityInput.setAttribute("value", "1");
    productElement.appendChild(quantityInput);
    // alert(quantityInput.value);

    const addButton = document.createElement("button");
    addButton.setAttribute("type", "button");
    addButton.textContent = "加入购物车";
    addButton.addEventListener("click", () => addToCart(product.id));
    productElement.appendChild(addButton);

    productContainer.appendChild(productElement);
});


let cartItems = []; // 购物车中的商品列表

// 加入购物车
function addToCart(productId) {
    const existingItem = cartItems.find(item => item.id === productId);
    // alert(existingItem==true);
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);

    if (existingItem) {
        // 商品已存在购物车中，增加数量
        existingItem.quantity += quantity;
    } else {
        // 商品不存在购物车中，添加新商品
        // alert(quantity);
        const product = getProductById(productId); // 根据商品id获取商品信息
        if (!product) {
            alert("无法找到该商品！");
            return;
        }
        if (quantity > product.stock) {
            alert("订购数量不能超过库存数量！");
            return;
        }
        // alert(quantity);
        product.quantity = quantity;
        cartItems.push(product);
    }

    updateCart();
    alert("加入购物车成功！")
}

// 更新购物车
function updateCart() {
    const cartTableBody = document.getElementById('cart-items');
    cartTableBody.innerHTML = '';

    let total = 0;

    cartItems.forEach(item => {
        const product = getProductById(item.id);
        const subtotal = product.price * item.quantity;
        total += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}元</td>
            <td><input type="number" value="${item.quantity}" min="1" onchange="updateCartItemQuantity('${item.id}', this.value)" /></td>
            <td>${subtotal}元</td>
        `;
        cartTableBody.appendChild(row);
    });

    const cartTotal = document.getElementById('cart-total');
    cartTotal.innerText = `${total}元`;
}

const orderItems = [];

function displayOrders() {
    const orderTableBody = document.getElementById("order-items");
    orderTableBody.innerHTML = "";

    orderItems.forEach((order) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.orderDate}</td>
      <td>${order.orderAmount}元</td>
      <td>${order.orderStatus}</td>
      <td>${order.shippingInfo.name} - ${order.shippingInfo.detailAddress} - ${order.shippingInfo.phone}</td>
    `;
        orderTableBody.appendChild(row);
    });
}


// 购物车结算
function checkout() {
    // 检查购物车是否为空
    if (cartItems.length === 0) {
        alert("购物车为空，请先添加商品");
        return;
    }

    // 检查是否已填写收货信息
    if (!shippingInfo.name || !shippingInfo.detailAddress || !shippingInfo.phone) {
        alert("请填写收货信息");
        return;
    }

    // 将购物车的商品信息转换为订单
    const order = {
        orderId: generateOrderId(), // 生成订单编号的函数，可根据实际需求自行实现
        orderDate: getCurrentDate(), // 获取当前日期的函数，可根据实际需求自行实现
        orderAmount: calculateOrderAmount(), // 计算订单金额的函数，可根据实际需求自行实现
        orderStatus: '已付款',
        shippingInfo: shippingInfo // 将收货信息添加到订单
    }

    // 将订单添加到订单明细数组
    orderItems.push(order);

    // 更新订单明细的显示
    displayOrders();

    // 清空购物车
    cartItems = [];
    updateCart();
}



function updateCartItemQuantity(productId, quantity) {
    const item = cartItems.find(item => item.id === productId);
    item.quantity = parseInt(quantity);
    updateCart();
}

function getProductById(productId) {
    return productsData.find(product => product.id === productId);
}

function toggleCart() {
    const cart = document.getElementById('cart');
    cart.style.display = cart.style.display === 'none' ? 'block' : 'none';
}

function toggleOrders() {
    const orders = document.getElementById('orders');
    orders.style.display = orders.style.display === 'none' ? 'block' : 'none';
}

function toggleAddress() {
    const address = document.getElementById('address');
    address.style.display = address.style.display === 'none' ? 'block' : 'none';
}

let shippingInfo = {
    name: "",
    detailAddress: "",
    phone: ""
};

function saveAddress() {
    // 获取输入框中的值
    var name = document.getElementById('name').value;
    var detailAddress = document.getElementById('detail-address').value;
    var phone = document.getElementById('phone').value;

    // 校验收货信息是否完整
    if (!name || !detailAddress || !phone) {
        alert('请填写完整的收货信息');
        return;
    }

    // 更新收货信息
    shippingInfo.name = name;
    shippingInfo.detailAddress = detailAddress;
    shippingInfo.phone = phone;

    // 清空输入框的值
    document.getElementById('name').value = "";
    document.getElementById('detailAddress').value = "";
    document.getElementById('phone').value = "";

    // 隐藏收货信息表单
    toggleAddress();

    // 显示保存成功的消息或进行其他操作
    alert("收货信息保存成功");
}




let orderIdCounter = 1; // 用于记录订单编号，初始值为1

function generateOrderId() {
    const orderId = orderIdCounter.toString().padStart(4, '0'); // 将订单编号转换为字符串并补全至4位数，例如 1 -> '0001'
    orderIdCounter++; // 自增订单编号计数器
    return orderId;
}

function getCurrentDate() {
    const currentDate = new Date(); // 获取当前日期和时间
    const year = currentDate.getFullYear(); // 获取年份
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 获取月份，并补全为两位数
    const day = String(currentDate.getDate()).padStart(2, '0'); // 获取日期，并补全为两位数
    const hours = String(currentDate.getHours()).padStart(2, '0'); // 获取小时，并补全为两位数
    const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // 获取分钟，并补全为两位数
    const seconds = String(currentDate.getSeconds()).padStart(2, '0'); // 获取秒钟，并补全为两位数
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 拼接日期和时间
    return formattedDate;
}


function calculateOrderAmount() {
    let totalAmount = 0;

    cartItems.forEach(item => {
        const product = getProductById(item.id); // 根据商品id获取商品信息
        const subtotal = product.price * item.quantity; // 计算单个商品的小计金额
        totalAmount += subtotal; // 累加小计金额到总金额
    });

    return totalAmount;
}
