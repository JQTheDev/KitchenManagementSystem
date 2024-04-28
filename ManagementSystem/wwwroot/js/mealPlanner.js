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
        const ingredientContainer = document.getElementById("styling");

        container.innerHTML = '';

        if (ingredients.length > 0) {
            ingredientContainer.style.display = "block";
            ingredients.forEach(ingredient => {
                const item = document.createElement("li");
                item.textContent = ingredient.name;
                item.style.color = 'red';
                container.appendChild(item);
            });
        } else {
            ingredientContainer.style.display = "none";
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
        const response = await fetch(`https://localhost:44342/api/Meals/ValidateMeal/${mealId}`);

        if (!response.ok) {
            
            return false;
        }

        
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
   
    if (selectedMeals.length < 4) {
        alert('Please add at least four meals before calculating.');
        return; 
    }
    calculateMeals();
});

async function calculateMeals() {
    try {
        const fundingResponse = await fetch("https://localhost:44342/api/Funding/1");
        if (!fundingResponse.ok) throw new Error("Failure getting funding");
        const fundingData = await fundingResponse.json();

        let totalBudget = Math.floor(fundingData.amount / 365);
        totalBudget += parseInt(document.getElementById("donationMoney").value) || 0;
        const mouthsToFeedInput = document.getElementById("mouthsToFeed").value;
        const mouthsToFeed = parseInt(mouthsToFeedInput) || 0;
        const mealIds = selectedMeals.map(meal => meal.mealId);
        if (mouthsToFeed === 0) {
            alert("Error: Mouths to feed cannot be 0");
            return;
        }
        else if (totalBudget === 0) {
            alert("Error: Donation money cannot be 0 if government funding is also 0");
            return;
        }
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

        if (!selectionResponse.ok) {
            
            const errorResponse = await selectionResponse.json();
            const errorMessage = errorResponse.message || "Error selecting meals";
            alert(errorMessage);
            return;
        }
        const result = await selectionResponse.json();
        console.log("Result from SelectMeals endpoint:", result); 
        updateMealResultsTable(result.value); 
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while calculating the best meals.');
    }
}

function updateMealResultsTable(meals) {
    const tableBody = document.getElementById('mealResultsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; 
    if (meals.length != 3) {
        alert("The total budget is not sufficient for the selected meals and mouths to feed. Please revise the budget");
        return;
    }
    if (Array.isArray(meals)) {
        meals.forEach(meal => {
            console.log("Processing meal:", meal);
            let row = tableBody.insertRow();
            row.insertCell(0).textContent = meal.name;
            row.insertCell(1).textContent = meal.nutritionLabel;
            row.insertCell(2).textContent = `$${meal.pricePerMeal.toFixed(2)}`;
            row.insertCell(3).textContent = `$${meal.totalPrice.toFixed(2)}`;
        });
    } else {
        
        console.error('Expected an array of meals, but received:', meals);
    }
}
