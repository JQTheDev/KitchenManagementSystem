document.addEventListener('DOMContentLoaded', function () {
    fetchMeals();
    document.getElementById('addMealBtn').addEventListener('click', addSelectedMeal);
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
                alert("Meal successfully added");
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

function calculateMeals() {
    // Your calculation logic goes here...
    console.log("Calculating best meals based on the selected options...");
    // ... Rest of the calculation logic
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
