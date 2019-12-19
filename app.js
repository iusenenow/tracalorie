// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  class Item {
    constructor(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
  }

  // Data Structure / State
  const data = {
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Cookie", calories: 400 },
      // { id: 2, name: "Eggs", calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems() {
      return data.items;
    },
    addItem(name, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById(id) {
      let foundItem;
      // Loop through items
      data.items.forEach(item => {
        if (item.id === id) foundItem = item;
      });
      return foundItem;
    },

    updateItem(name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let foundItem;

      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          foundItem = item;
        }
      });
      return foundItem;
    },

    deleteItem(id) {
      // Get index
      const index = data.items.map(item => item.id).indexOf(id);
      // Remove item
      data.items.splice(index, 1);
    },

    clearAllItems() {
      data.items = [];
    },

    setCurrentItem(item) {
      data.currentItem = item;
    },

    getCurrentItem() {
      return data.currentItem;
    },

    getTotalCalories() {
      let total = 0;
      // Loop through items and add cals
      data.items.forEach(item => {
        total += item.calories;
      });
      // Set total cal in data structure
      data.totalCalories = total;
      return data.totalCalories;
    },

    logData() {
      return data;
    }
  };
})(); // Extra pair of parentheses to invoke function

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    form: ".form",
    totalCalories: ".total-calories"
  };

  // Public methods
  return {
    populateItemList(items) {
      let html = "";
      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong>${item.calories} Calories
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput() {
      return {
        name: document.querySelector(UISelectors.form).name.value.trim(),
        calories: document.querySelector(UISelectors.form).calories.value.trim()
      };
    },

    addListItem(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create html
      let html = `<li class="collection-item" id="item-${item.id}">
      <strong>${item.name}: </strong>${item.calories} Calories
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
    </li>`;
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentHTML("beforeend", html);
    },

    updateListItem(item) {
      Array.from(document.querySelectorAll(UISelectors.listItems)).forEach(
        listItem => {
          if (listItem.getAttribute("id") === `item-${item.id}`) {
            listItem.innerHTML = `<strong>${item.name}: </strong>${item.calories} Calories
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
          }
        }
      );
    },

    deleteListItem(id) {
      document.querySelector(`#item-${id}`).remove();
    },

    clearInput() {
      document.querySelector(UISelectors.form).reset();
    },

    addItemToForm() {
      document.querySelector(
        UISelectors.form
      ).name.value = ItemCtrl.getCurrentItem().name;

      document.querySelector(
        UISelectors.form
      ).calories.value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    removeItems() {
      Array.from(
        document.querySelectorAll(UISelectors.listItems)
      ).forEach(listItem => listItem.remove());
    },

    hideList() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    showTotalCalories(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },

    clearEditState() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    showEditState() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },

    getSelectors() {
      return UISelectors;
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Clear items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // Add item submit
  const itemAddSubmit = function(e) {
    e.preventDefault();
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name.length && input.calories.length) {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // Clear fields
      UICtrl.clearInput();
    }
  };

  // Click edit item
  const itemEditClick = function(e) {
    e.preventDefault();
    if (e.target.classList.contains("edit-item")) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;
      // Break into an array
      const listIdArr = listId.split("-");
      // Get the actual id
      const id = parseInt(listIdArr[1]);
      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      // Add item to form
      UICtrl.addItemToForm();
    }
  };

  // Update item submit
  const itemUpdateSubmit = function(e) {
    e.preventDefault();

    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
  };

  // Delete button event
  const itemDeleteSubmit = function(e) {
    e.preventDefault();
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    // Check if any items
    if (!ItemCtrl.getItems().length) UICtrl.hideList();
  };

  // Clear Items event
  const clearAllItemsClick = function(e) {
    e.preventDefault();
    // Delete all items from data structure
    ItemCtrl.clearAllItems();
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    // Remove form UI
    UICtrl.removeItems();

    UICtrl.hideList();

    UICtrl.clearEditState();
  };

  // Public methods
  return {
    init: function() {
      // Clear edit state / set initial set
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (!items.length) UICtrl.hideList();
      // Populate list with items
      UICtrl.populateItemList(items);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

// Initialize App
App.init();
