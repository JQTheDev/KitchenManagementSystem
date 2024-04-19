document.addEventListener('DOMContentLoaded', function () {
    fetchMeals();
    document.getElementById('addMealBtn').addEventListener('click', addSelectedMeal);
    fetchIngredients();
});

let selectedMeals = [];

function fetchMeals() {
    const endpoint = "https://localhost:44342/api/Meals";
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            populateMeals(data);
        })
        .catch(error => {
            console.error('Error fetching meals:', error);
        });
}
async function fetchIngredients() {
    try {
        const response = await fetch("https://localhost:44342/api/Ingredients/Empty");
        if (!response.ok) {
            throw new Error("Failed to fetch ingredients with zero stock.");
        }
        const ingredients = await response.json();
        const container = document.getElementById("emptyIngredients");
        container.innerHTML = ''; // Clear previous entries

        if (ingredients.length > 0) {
            const ingredientContainer = document.getElementById("emptyIngredientsContainer");
            ingredientContainer.style.display = "block"; // Only display if there are ingredients with zero stock

            ingredients.forEach(ingredient => {
                const item = document.createElement("li");
                item.textContent = ingredient.name;
                container.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load ingredients with zero stock.');
    }
}


function populateMeals(meals) {
    const selectElement = document.getElementById('mealSelect');
    meals.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by default

    meals.forEach(meal => {
        const option = document.createElement('option');
        option.value = meal.mealId;
        option.textContent = meal.name;
        selectElement.appendChild(option);
    });
}

function addSelectedMeal() {
    const mealSelect = document.getElementById('mealSelect');
    const mealId = mealSelect.value;
    const mealName = mealSelect.options[mealSelect.selectedIndex].text;

    if (!mealId) {
        alert('Please select a meal to add.');
        return;
    }

    // Check if the meal is already in the selectedMeals array
    const isMealAlreadySelected = selectedMeals.some(meal => meal.mealId === mealId);
    if (isMealAlreadySelected) {
        alert('This meal has already been added.');
        return;
    }

    validateMeal(mealId)
        .then(isValid => {
            if (isValid) {
                selectedMeals.push({ mealId, name: mealName });
                updateSelectedMealsList();
            } else {
                alert('Selected meal does not meet the criteria.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while validating the meal.');
        });
}


function updateSelectedMealsList() {
    const listElement = document.getElementById('selectedMeals');
    listElement.innerHTML = ''; // Clear current list

    selectedMeals.forEach(meal => {
        const listItem = document.createElement('li');
        listItem.textContent = meal.name;
        listElement.appendChild(listItem);
    });
}

async function validateMeal(mealId) {
    try {
        // Making a GET request to the new validate meal endpoint
        const response = await fetch(`https://localhost:44342/api/Meals/ValidateMeal/${mealId}`);

        if (!response.ok) {
            // If the response status is not OK, it means there was a validation error or other issue
            return false;
        }

        // If everything was fine, return true indicating the meal is valid
        return true;
    } catch (error) {
        console.error("Error during meal validation:", error);
        alert("An error occurred while validating the meal.");
        return false;
    }
}
document.getElementById('ingredientQueryBtn').addEventListener('click', function () {
    window.location.href = '/Stock/IngredientQuery';
});

document.getElementById('mealQueryBtn').addEventListener('click', function () {
    window.location.href = '/Stock/MealQuery';
});

document.getElementById('calculateBtn').addEventListener('click', function () {
    // Check if at least four meals have been added
    if (selectedMeals.length < 4) {
        alert('Please add at least four meals before calculating.');
        return; // Exit the function if not enough meals have been selected
    }
    calculateMeals();
});

async function calculateMeals() {
    try {
        const fundingResponse = await fetch("https://localhost:44342/api/Funding/1");
        if (!fundingResponse.ok) throw new Error("Failure getting funding");
        const fundingData = await fundingResponse.json();

        let totalBudget = Math.floor(fundingData.amount / 365) + parseInt(document.getElementById("donationMoney").value);
        const mouthsToFeed = parseInt(document.getElementById("mouthsToFeed").value);
        const mealIds = selectedMeals.map(meal => meal.mealId);

        const mealSelectionData = {
            MouthsToFeed: mouthsToFeed,
            TotalBudget: totalBudget,
            MealIds: mealIds
        };

        const selectionResponse = await fetch('https://localhost:44342/api/Meals/SelectMeals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealSelectionData)
        });

        if (!selectionResponse.ok) throw new Error("Error selecting meals");
        const result = await selectionResponse.json();

        updateMealResultsTable(result); 
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while calculating the best meals.');
    }
}

function updateMealResultsTable(meals) {
    const tableBody = document.getElementById('mealResultsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table data

    meals.forEach(meal => {
        let row = tableBody.insertRow();
        row.insertCell(0).textContent = meal.name;
        row.insertCell(1).textContent = meal.nutritionLabel;
        row.insertCell(2).textContent = `$${meal.price.toFixed(2)}`;
        row.insertCell(3).textContent = `$${(meal.price * document.getElementById("mouthsToFeed").value).toFixed(2)}`;
    });
}


//VALIDATE MEAL CLIENT-SIDE

//async function validateMeal(mealId) {
//    try {
//        const firstResponse = await fetch(`https://localhost:44342/api/MealIngredients/ByMeal/${mealId}`)
//        if (!firstResponse.ok) {
//            throw new Error("first reponse errored");
//        }
//        const mealIngredients = await firstResponse.json();
//        for(const mealIngredient of mealIngredients) {
//            const response = await fetch(`https://localhost:44342/api/Ingredients/${mealIngredient.ingredientId}`);
//            if (!response.ok) {
//                throw new Error("Error when fetching ingredients within meal");
//            }
//            const ingredient = await response.json();
//            if (ingredient.fat === null || ingredient.salt === null || ingredient.calories == null) {
//                return false;
//            }
//        }
//        return true;
//    }
//    catch (error){
//        console.error("Validate meals function failed. Error:", error)
//    }
//}
