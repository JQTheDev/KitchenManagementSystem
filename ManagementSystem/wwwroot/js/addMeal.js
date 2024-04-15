document.addEventListener('DOMContentLoaded', function () {
    const mealForm = document.getElementById('mealForm');
    mealForm.addEventListener('submit', saveMeal);

    document.getElementById('addIngredientToMealBtn').addEventListener('click', addIngredientToList);


    fetchIngredients();
});

let mealIngredients = [];

function fetchIngredients() {
    const endpoint = "https://localhost:44342/api/Ingredients";
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            populateIngredients(data);
        })
        .catch(error => {
            console.error('Error fetching ingredients:', error);
        });
}

function populateIngredients(ingredients) {
    const selectElement = document.getElementById('ingredientSelect');
    selectElement.innerHTML = '<option value="">Please Select</option>';

    ingredients.sort((a, b) => a.name.localeCompare(b.name));

    ingredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient.ingredientId;
        option.textContent = ingredient.name;
        selectElement.appendChild(option);
    });
}

function addIngredientToList() {
    const ingredientSelect = document.getElementById('ingredientSelect');
    const quantityInput = document.getElementById('ingredientQuantity');
    if (ingredientSelect.value && quantityInput.value) {
        mealIngredients.push({
            ingredientId: ingredientSelect.value,
            quantity: parseFloat(quantityInput.value)
        });
        updateIngredientList();
        ingredientSelect.selectedIndex = 0;
        quantityInput.value = '';
    } else {
        alert('Please select an ingredient and enter a quantity.');
    }
}

function updateIngredientList() {
    const ingredientListElement = document.getElementById('ingredientList');
    ingredientListElement.innerHTML = ''; 
    mealIngredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `Ingredient ID: ${ingredient.ingredientId}, Quantity: ${ingredient.quantity}`;
        ingredientListElement.appendChild(li);
    });
}

function saveMeal(event) {
    event.preventDefault();
    const mealNameInput = document.getElementById('mealName');
    const mealName = mealNameInput.value.trim();

    if (!mealName) {
        alert('Please enter a meal name.');
        return;
    }

    if (mealIngredients.length === 0) {
        alert('Please add at least one ingredient to the meal before saving.');
        return;
    }

    const mealData = {
        Name: mealName,
        Ingredients: mealIngredients.map(ingredient => ({
            IngredientId: parseInt(ingredient.ingredientId, 10),
            Quantity: parseFloat(ingredient.quantity)
        }))
    };

    fetch('https://localhost:44342/api/Meals/WithIngredients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mealData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(mealResponseData => {
            console.log(mealResponseData);
            alert('Meal with ingredients saved successfully!');
            mealNameInput.value = '';
            mealIngredients = [];
            updateIngredientList();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while saving the meal with ingredients.');
        });
}
