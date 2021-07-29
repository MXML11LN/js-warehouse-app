
;(function () {

//Document elements variables


function createElement(tagName="div",classList =""){
    let element = document.createElement(`${tagname}`);
    element.classList.add(`${classList}`);
    return element
};



const listOfStores              = document.querySelector("#js-stores-list__items");// where to place generated stores
const storeInformation          = document.querySelector("#js-store-information");// place to generated info and product lists
const storesSearchButton        = document.querySelector("#js-search-button-stores");
const storesRefreshButton       = document.querySelector("#js-refresh-button-stores");
const storesSearchInput         = document.querySelector("#js-search-input-stores");

const createStoreBtn            = document.querySelector("#js-create-store-btn");
const createStoreModal          = document.querySelector("#js-create-store-modal");
const closeStoreModal           = document.querySelector("#close-create-store-modal");

const productFooter             = document.querySelector("#js-product-footer");

const createProductBtn          = document.querySelector("#js-create-product-btn");
const closeProductModal         = document.querySelector("#js-close-product-modal");
const createProductModal        = document.querySelector("#js-create-product-modal");
const deleteStoreBtn            = document.querySelector("#js-delete-store");


const postCreatedStore =        document.querySelector("#js-create-new-store");

const storeName =               document.querySelector("#new-store-name");
const storeEmail =              document.querySelector("#new-store-email");
const storePhone =              document.querySelector("#new-store-phone");
const storeAddress =            document.querySelector("#new-store-address");
const storeEstablished =        document.querySelector("#new-store-established");
const storeArea =               document.querySelector("#new-store-area");


//Document elements variables=========================================================== TODO: fetch from server
const getStoresObject = (array) => (array.reduce((object,store)=>({
    ...object,
    [store.id]:store}),{}));

const serverUrl = "http://localhost:3000/api/"

let Stores = [];
let targetStore,targetStoreId,filteredProducts,targetStoreProducts,blankStoresText,productHtml;


let productsTable = document.createElement("table");//create table section 
function fillProductsTable(){
    productsTable.classList.add("products-table");
    productsTable.innerHTML=`
        <caption class="products-table__products-header">Products</caption>
        <tr class="products-table__grid table-header">
            <th class="products-table__product-name ">Name</th>
            <th class="products-table__price">Price</th>
            <th class="products-table__specs">Specs</th>
            <th class="products-table__sup-info ">Supplier Info</th>
            <th class="products-table__origin-country ">Country of Origin</th>
            <th class="products-table__prod-comp ">Prod. Company</th>
            <th class="products-table__rating">Rating</th>   
        </tr>
    `;
}


function getEstStoreDate(date){
    let options= {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    };
    let modDate = new Date(Date.parse(date));
    return modDate.toLocaleString("en-US", options);
};

function createStoreElements (storeItem){
    let generatedStore = document.createElement("li");//render stores list from data.js
    generatedStore.classList.add("stores-list__store");
    generatedStore.setAttribute("data-storeId",storeItem["id"])
    generatedStore.innerHTML = `
    <div class="stores-list__row">
        <h4 class="stores-list__store-name">${storeItem["Name"] || "no info"}</h4>
            <div class="stores-list__store-square">
                <span class="stores-list__value">${storeItem["FloorArea"] || "no info"}</span>
                <span class="stores-list__units">sq.m</span>
            </div>
        </div>
        <div class="stores-list__row">
            <address class="store-list__address">${storeItem["Address"] || "no info"}</address>
        </div>`;

    listOfStores.appendChild(generatedStore);
}

//remove css selector of activation from all functions
function removeActiveClasslist(){
    let allStores=document.querySelectorAll(".stores-list__store");
    allStores.forEach(item => item.classList.remove("js-activated"))
}

            function fetchTargetStoreData(event){
                let target = event.target;
                targetStore = target.closest(".stores-list__store");
                targetStoreId = targetStore.getAttribute("data-storeId");

                fetch((`${serverUrl}Stores/${targetStoreId}/rel_Products`)) //http://localhost:3000/api/Stores/2/rel_Products
                .then(response => response.json())
                .then(products => {
                    filteredProducts = getProductsStatus(products);
                    targetStoreProducts = products;//Array [[ok prods array],[storage prods array],[out of stock prods array]]
                    if(targetStoreProducts.length>0){
                        renderStoreData(products)} else{
                            blankStoresText ="No products ...";
                            renderStoreData(products)
                        };
                })
            }
//parse default data============
function getProductsStatus(products){
    let statusOutOfStock    = products.filter((product) => (product["Status"] === "OUT_OF_STOCK"));
    let statusStorage       = products.filter((product) => (product["Status"] === "STORAGE"));
    let statusOK            = products.filter((product) => (product["Status"] === "OK"));
    let filteredProductsArray = [statusOK,statusStorage,statusOutOfStock];
    return filteredProductsArray;
}


function renderStoreData(products){

    storeInformation.innerHTML = '';
    removeActiveClasslist();//remove active-js class for css
    
    targetStore.classList.add("js-activated");

    let activeStore = getStoresObject(Stores)[targetStoreId];

    ///active store with click on it
    let activeStoreDetails = document.createElement("div") //create div

    activeStoreDetails.classList.add("store-details");

    activeStoreDetails.innerHTML = `
        <div class="store-details__header">
            <h3>Store details</h3>
        </div>
        <div class="store-details__information">
            <div class="store-details__column">
                <div class="information-item">
                    <span class="highlight">Email:</span>
                    <a class="store-intel" href="${activeStore["Email"]}">${activeStore["Email"]}</a>
                </div>
                <div class="information-item">
                    <span class="highlight">Address:</span>
                    <address class="store-intel">${activeStore["Address"]}</address>
                </div>
                <div class="information-item">
                    <span class="highlight">Phone:</span>
                    <a class="store-intel" href="tel:${activeStore["PhoneNumber"]}" rel="nofollow">${activeStore["PhoneNumber"]}</a>
                </div>
            </div>
            <div class="store-details__column">
                <div class="information-item">
                    <span class="highlight">Established date:</span>
                    <date class="store-intel"> ${getEstStoreDate(activeStore["Established"])}</date>
                </div>
                <div class="information-item">
                    <span class="highlight">Floor area:</span>
                    <label class="store-intel">${activeStore["FloorArea"]}</label>
                </div>
            </div>
        </div>
        <div class="store-details__controls">
            <div  class="store-details__controls-container">
                <button class="store-details__button controls-button arrow-up-btn"></button>
                <button class="store-details__button controls-button arrow-down-btn"></button>
                <button class="store-details__button controls-button pin-btn"></button>
            </div>
        </div>
        <div class="store-details__status">
            <button id="js-all-btn" class="store-details__quantity">
                <div class="store-details__number">${products.length}</div>
                <div class="store-details__fulfillment">All</div>
            </button>
            <div class="store-details__warehouse-products">
                <button  id="js-ok-btn" class="store-details__item">
                    <span class=" warehouse-products__full products-circle"></span>
                    <span class="products-quantity">${filteredProducts[0].length}</span>
                    <mark class="products-status">OK</mark>
                </button>
                <button  id="js-storage-btn" class="store-details__item">
                    <span class="warehouse-products__storage products-circle"></span> 
                    <span class="products-quantity">${filteredProducts[1].length}</span>
                    <mark class="products-status">Storage</mark>
                </button>
                <button  id="js-out-stock-btn" class="store-details__item">
                    <span class="warehouse-products__out products-circle"></span>
                    <span class="products-quantity out">${filteredProducts[2].length}</span>
                    <mark class="products-status ">Out of stock</mark>
                </button>
            </div>
        </div>
    `;
    
    
    storeInformation.appendChild(activeStoreDetails);


    storeInformation.appendChild(productsTable);

    fillProductsTable();

    // let activeStorProducts = activeStore["rel_Products"];// products of active store

    products.map(createActiveStoreProducts);
}

function createActiveStoreProducts(product){
    let productHtml = document.createElement("tr");
    productHtml.classList.add("products-table__item");
    productHtml.innerHTML=`
    <td class="products-table__product-name">
        <div class="products-table__product-title">${product["Name"]}</div>
        <div class="products-table__product-number">${product["id"]}</div>
    </td>
    <td class="products-table__price">
        <span>${product["Price"]}</span><span class="store-details__product-currency">  usd</span>
    </td>
    <td class="products-table__specs">${product["Specs"]}</td>
    <td class="products-table__sup-info">${product["SupplierInfo"]}</td>
    <td class="products-table__origin-country">${product["MadeIn"]}</td>
    <td class="products-table__prod-comp">${product["ProductionCompanyName"]}</td>
    `;
    productsTable.appendChild(productHtml);
    renderProductRating(product["Rating"]);
    productFooter.classList.remove("js-hide");
}

function renderProductRating(rate){
    let td = document.createElement("td");
    td.classList.add("products-table__rating")

    let div = document.createElement("div");
    div.classList.add("products-table__stars");

    let button = document.createElement("button");
    button.classList.add("products-table__more-info");
    button.innerText=`x`

    for(let i = 0; i < 5;i++){
        let span = document.createElement("span");
        span.innerText = "★";
        if( i < rate){
            span.classList.add("js-active-star");
        }
        div.append(span);
    }
    td.appendChild(div);
    td.appendChild(button);
    productHtml.appendChild(td)
}

//Render stores from Stores in data.js


let displayStores = function(){// display stores from sorting original array

    let filteredStores = filterStores();
    let arrayOfStores = Stores;

    if(filteredStores.length>0){
        arrayOfStores = filteredStores;}

    listOfStores.innerHTML="";

    function renderStores (array){
        if(array.length>0){
            array.map(createStoreElements);
        }else{
            let emptyStoresList = document.createElement("div");
            emptyStoresList.classList.add("blank-spinner");
            emptyStoresList.innerHTML = `
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>`;
            listOfStores.append(emptyStoresList);
        }
    }
    function filterStores (){

        let searchValue = storesSearchInput.value.toLowerCase();
    
        let filteredStores = Stores.filter((store)=>((store.Name.toLowerCase().includes(searchValue)) ||
        (store.Address.toLowerCase().includes(searchValue)) ||
        (store.FloorArea.toString().includes(searchValue))));
        return filteredStores
    }

    renderStores(arrayOfStores);
}

function refreshInputValue(){
    storesSearchInput.value = "";
    displayStores();
}

//Fetch data from stores server
function fetchServerStores(){
    fetch((serverUrl + "Stores"))
    .then(res => res.json())
    .then(data => {
        Stores = data;
        displayStores();
    })
    .catch( error => console.log(error))
}
//Fetch data from stores server

displayStores();
fetchServerStores();

function renderFilterProducts(event){ //render store-list based on filter
    let click = event.target;
    let targetClick = click.closest("button")?.id;
    //find filter button
    function fillFilterTable(array){
        productsTable.innerHTML= ``;
        fillProductsTable();
        array.map(createActiveStoreProducts)
    }
    if(targetClick == "js-all-btn"){fillFilterTable(targetStoreProducts)}
    if(targetClick == "js-ok-btn"){fillFilterTable(filteredProducts[0])}
    if(targetClick == "js-storage-btn"){fillFilterTable(filteredProducts[1])}
    if(targetClick == "js-out-stock-btn"){fillFilterTable(filteredProducts[2])}
}

// modal windows show -hide function
function showModal(event){
    event.preventDefault();
    if(event.target === createStoreBtn || event.target === closeStoreModal){createStoreModal.classList.toggle("js-hide")}
    if(event.target === createProductBtn || event.target === closeProductModal){createProductModal.classList.toggle("js-hide")}
}
// modal windows show -hide function

// create, delete stores, create product functions===================================
function deleteStore(){
        alert("Are you sure want to delete current store");
        fetch((`${serverUrl}Stores/${targetStoreId}`),{method: 'DELETE',});
        // targetStore,targetStoreId,filteredProducts,targetStoreProducts = null;
        fetchServerStores();
        document.location.reload();
        showDeleteStoreToast();
}
function showDeleteStoreToast(){
    messageToast = document.createElement("div");
    messageToast.classList.add("message-toast");
    messageToast.innerText="The store was deleted successfully";
    document.body.appendChild(messageToast);
    setTimeout(messageToast.parentNode.removeChild(messageToast),2000);
}

// create, delete stores, create product functions===================================


//Listeners------------------------------------------------------------------------

listOfStores.addEventListener("click",fetchTargetStoreData);
storesSearchButton.addEventListener("click",displayStores);
storesRefreshButton.addEventListener("click",refreshInputValue);
storeInformation.addEventListener("click",renderFilterProducts); //listen all stores section of document

// modal window listeners
createStoreBtn.addEventListener("click",showModal);
closeStoreModal.addEventListener("click",showModal);
createProductBtn.addEventListener("click",showModal);
closeProductModal.addEventListener("click",showModal);
deleteStoreBtn.addEventListener("click",deleteStore);

let postCreatedStore = document.querySelector("#js-create-new-store");

let storeName = document.querySelector("#new-store-name");
let storeEmail = document.querySelector("#new-store-email");
let storePhone = document.querySelector("#new-store-phone");
let storeAddress = document.querySelector("#new-store-address");
let storeEstablished = document.querySelector("#new-store-established");
let storeArea = document.querySelector("#new-store-area");


postCreatedStore.addEventListener("click",createNewStore);

function createNewStore(event){
    event.preventDefault();
    let newStore ={
            "Name"        : storeName.value,
            "Email"       : storeEmail.value,
            "PhoneNumber" : storePhone.value,
            "Address"     : storeAddress.value,
            "Established" : storeEstablished.value,
            "FloorArea"   : +storeArea.value,
    };
fetchServerStores();
createStoreModal.classList.add("js-hide");
postData(newStore)
.then((data) => {
    console.log(data); //        JSON data parsed by `response.json()` call
});
}
async function postData(data = {}) {
    const response = await fetch((`${serverUrl}Stores`), {
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        "Accept"      : "application/json"
        }, 
        body: JSON.stringify(data),
    });
    return await response.json();
}

})();