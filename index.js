import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Set database URL
const appSettings = {
    databaseURL: "https://realtime-database-af01d-default-rtdb.europe-west1.firebasedatabase.app/"
}

// Initialize app and database
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

// Get relevant elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// Push input field item to database and clear the input field
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    push(shoppingListInDB, inputValue)
    clearInputFieldEl()
})

// Execute the item adding when the user presses enter on the keyboard
inputFieldEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addButtonEl.click()
    }
})

onValue(shoppingListInDB, function(snapshot) {
    // If elements exist in database, show them 
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItemToShoppingListEl(currentItem)
        }    
    } 
    // Else show No item text
    else {
        shoppingListEl.innerHTML = `<h6>No items here... yet</h6>`
    }
})

// Clears shopping List
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Clears input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Add item to the shopping list
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    // When item is clicked, remove it from the database
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}