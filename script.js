// getting inputs and buttons
const title = document.getElementById('title');
const price = document.getElementById('price');
const taxes = document.getElementById('taxes');
const ads = document.getElementById('ads');
const discount = document.getElementById('discount');
const total = document.getElementById('total');
const count = document.getElementById('count');
const category = document.getElementById('category');
const createBtn = document.getElementById('submit');

let mode = 'Create';
let temp;//global variable used to get the index of the item you want to update inside create function

// Compute Total Price

function ComputeTotalPrice() {
    if (price.value != '') {
        let totalPrice = (+price.value + +taxes.value + +ads.value) - +discount.value;//write + before the string to convert it to number
        total.innerHTML = totalPrice;
        total.style.background = 'green'
    }
    else {
        total.innerHTML = 0;
        total.style.background = 'rgb(170, 71, 71)';
    }
}

// Create Product

let arrayOfProducts;

if (localStorage.product != null) {
    arrayOfProducts = JSON.parse(localStorage.product);
} else {
    arrayOfProducts = [];
}

createBtn.onclick = function () {
    if (title.value === '' || price.value === '' || category.value === '') {
        alert('Please fill in all the required fields');
        return;
    }

    let newProduct = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value,
    };

    if (newProduct.count < 100) {
        if (mode === 'Create') {
            if (newProduct.count > 1) {
                for (let i = 0; i < newProduct.count; i++) {
                    arrayOfProducts.push(newProduct);
                }
            } else {
                arrayOfProducts.push(newProduct);
            }
        }
        else {
            arrayOfProducts[temp] = newProduct;
            mode = "Create";
            count.style.display = 'block';
            createBtn.innerHTML = 'Create';
        }
        clearData();
    }else{
        alert('You can not add more than 99 products');
        return;
    }

    // Save to local storage
    localStorage.setItem('product', JSON.stringify(arrayOfProducts));

    drawProduct();
};

// Clear Inputs After Creation

function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

// Reading Product Info

const tableBody = document.getElementById('table-body');
function drawProduct() {
    ComputeTotalPrice();

    let table = '';
    for (let i = 0; i < arrayOfProducts.length; i++) {
        table += `<tr>
        <td>${i+1}</td>
        <td>${arrayOfProducts[i].title}</td>
        <td>${arrayOfProducts[i].price}</td>
        <td>${arrayOfProducts[i].taxes}</td>
        <td>${arrayOfProducts[i].ads}</td>
        <td>${arrayOfProducts[i].discount}</td>
        <td>${arrayOfProducts[i].total}</td>
        <td>${arrayOfProducts[i].category}</td>
        <td><button onclick="updateProduct(${i})" id="update">update</button></td>
        <td><button onclick="deleteProduct(${i})" id="delete">delete</button></td>
        </tr>`
    }
    tableBody.innerHTML = table;
    let deleteAllBtn = document.getElementById('delete-all');
    if (arrayOfProducts.length > 0) {
        deleteAllBtn.innerHTML = `
        <button onclick="deleteAll()">delete all (${arrayOfProducts.length})</button>
        `
    } else {
        deleteAllBtn.innerHTML = '';
    }
}
drawProduct();

// Deleting Product

// Delete Single Product
function deleteProduct(index) {
    arrayOfProducts.splice(index, 1);
    localStorage.setItem('product', JSON.stringify(arrayOfProducts));
    drawProduct();
}

// Delete All Products
function deleteAll() {
    localStorage.clear();
    arrayOfProducts.splice(0);//delete all items
    drawProduct();
}

// Updating Product

function updateProduct(index) {
    // console.log(arrayOfProducts[index]);
    title.value = arrayOfProducts[index].title;
    price.value = arrayOfProducts[index].price;
    taxes.value = arrayOfProducts[index].taxes;
    ads.value = arrayOfProducts[index].ads;
    discount.value = arrayOfProducts[index].discount;
    ComputeTotalPrice();
    count.style.display = 'none';
    category.value = arrayOfProducts[index].category;
    createBtn.innerHTML = 'Update';
    mode = 'Update';
    temp = index;
    scroll({
        top: 0,
        behavior: 'smooth',
    })
}

// Search For Product

const searchInput = document.getElementById('search');
const searchByTitleBtn = document.getElementById('title-search-btn');
const searchByCategoryBtn = document.getElementById('category-search-btn');

let searchMode = 'title';

// get search mode function
let getSearchMode = (id) => {
    if (id === 'title-search-btn') {
        searchMode = 'title';
    }
    else {
        searchMode = 'category';
    }
    searchInput.placeholder = `search by ${id === 'title-search-btn' ? "title" : "category"} `;
    searchInput.focus();
    searchInput.value = '';
    drawProduct();
}

// search function
function searchForProduct(value) {
    let table = '';
    for (let i = 0; i < arrayOfProducts.length; i++) {
        if (value && searchMode === 'title') {
            if (arrayOfProducts[i].title.toLowerCase().includes(value.toLowerCase())) {
                table += `<tr>
                    <td>${i}</td>
                    <td>${arrayOfProducts[i].title}</td>
                    <td>${arrayOfProducts[i].price}</td>
                    <td>${arrayOfProducts[i].taxes}</td>
                    <td>${arrayOfProducts[i].ads}</td>
                    <td>${arrayOfProducts[i].discount}</td>
                    <td>${arrayOfProducts[i].total}</td>
                    <td>${arrayOfProducts[i].category}</td>
                    <td><button onclick="updateProduct(${i})" id="update">update</button></td>
                    <td><button onclick="deleteProduct(${i})" id="delete">delete</button></td>
                    </tr>`
            }
        }
        else {
            if (arrayOfProducts[i].category.toLowerCase().includes(value.toLowerCase())) {
                table += `<tr>
                    <td>${i}</td>
                    <td>${arrayOfProducts[i].title}</td>
                    <td>${arrayOfProducts[i].price}</td>
                    <td>${arrayOfProducts[i].taxes}</td>
                    <td>${arrayOfProducts[i].ads}</td>
                    <td>${arrayOfProducts[i].discount}</td>
                    <td>${arrayOfProducts[i].total}</td>
                    <td>${arrayOfProducts[i].category}</td>
                    <td><button onclick="updateProduct(${i})" id="update">update</button></td>
                    <td><button onclick="deleteProduct(${i})" id="delete">delete</button></td>
                    </tr>`
            }
        }
    }
    tableBody.innerHTML = table;
}

// Validation