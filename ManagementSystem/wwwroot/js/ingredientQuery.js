document.addEventListener('DOMContentLoaded', function () {
    fetchIngredients();
    setupModalTrigger();
    setupSortingOptions();
});

function fetchIngredients() {
    const endpoint = "https://localhost:44342/api/Ingredients"
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

function setupSortingOptions() {
    document.getElementById('sortDefault').addEventListener('change', function () {
        // Ensure at least one checkbox is always checked
        if (!this.checked && !document.getElementById('sortAlphabetical').checked) {
            this.checked = true;
        } else if (this.checked) {
            document.getElementById('sortAlphabetical').checked = false;
            fetchIngredients(); // Re-fetch and populate ingredients
        }
    });

    document.getElementById('sortAlphabetical').addEventListener('change', function () {
        // Ensure at least one checkbox is always checked
        if (!this.checked && !document.getElementById('sortDefault').checked) {
            this.checked = true;
        } else if (this.checked) {
            document.getElementById('sortDefault').checked = false;
            fetchIngredients(); // Re-fetch and populate ingredients
        }
    });
}

function setupModalTrigger() {
    // Setting up Pop up tab
    var btn = document.getElementById('addIngredientBtn');
    var modal = document.getElementById('ingredientModal');
    var span = document.getElementsByClassName('close-button')[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
        /*document.getElementById('ingredientId').value = '';*/
        document.getElementById('name').value = '';
        document.getElementById('calories').value = '';
        document.getElementById('salt').value = '';
        document.getElementById('fat').value = '';
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
        document.getElementById('ingredientId').value = '';
        document.getElementById('name').value = '';
        document.getElementById('calories').value = '';
        document.getElementById('salt').value = '';
        document.getElementById('fat').value = '';
    };

    // Close the modal if the user clicks outside of it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}



function populateIngredients(ingredients) {
    const selectElement = document.getElementById('ingredientList');
    selectElement.innerHTML = '<option>Please Select</option>'; // Clear existing options

    // Determine sorting order
    const sortAlphabetical = document.getElementById('sortAlphabetical').checked;

    if (sortAlphabetical) {
        ingredients.sort((a, b) => a.name.localeCompare(b.name));
    }

    ingredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient.ingredientId; // It's better to use value attribute for the value
        option.textContent = ingredient.name;
        selectElement.appendChild(option);
    });
}

async function getIngredientInfo() {
    const selectElement = document.getElementById("ingredientList")
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const ingredientId = selectedOption.value;

    const endpoint = `https://localhost:44342/api/Ingredients/${ingredientId}`

    fetch(endpoint)
    .then(response => {
        if (!response.ok) {
            throw new Error("could not complete request")
        }
        return response.json();
    })
        .then(ingredient => {
            console.log(ingredient);
            // Assuming you want to populate fields in your modal, you'd do something like this:
            document.getElementById("updateId").value = ingredient.ingredientId;
            document.getElementById('updateName').value = ingredient.name;
            document.getElementById('updateCalories').value = ingredient.calories;
            document.getElementById('updateSalt').value = ingredient.salt;
            document.getElementById('updateFat').value = ingredient.fat;
            document.getElementById('updateQuantity').value = ingredient.quantity;
            document.getElementById("updateSection").style.display = "block";

    })
    .catch(error => {
        console.error('Error:', error);
    });

}

async function updateIngredient() {

    const _ingredientId = document.getElementById("updateId").value;
    const _name = document.getElementById("updateName").value;
    const _quantity = document.getElementById("updateQuantity").value;
    const _salt = document.getElementById("updateSalt").value;
    const _calories = document.getElementById("updateCalories").value;
    const _fat = document.getElementById("updateFat").value;


    const endpoint = `https://localhost:44342/api/Ingredients/${_ingredientId}`;
    const data = {
        ingredientID: _ingredientId,
        name: _name,
        calories: _calories,
        salt: _salt,
        fat: _fat,
        quantity: _quantity
    };

    try {
        const response = await fetch(endpoint, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Update successful');
            document.getElementById("updateSection").style.display = "none";
            document.getElementById("updateId").value = "";
            document.getElementById("updateQuantity").value = "";
        } else {
            throw new Error('Failed to update ingredient');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the ingredient.');
    }
}
async function deleteIngredient() {
    const selectElement = document.getElementById("ingredientList")
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const ingredientId = selectedOption.value;

    if (ingredientId === "") {
        alert("Please select a valid ingredient to delete.");
        return;
    }

    const endpoint = `https://localhost:44342/api/Ingredients/${ingredientId}`;
    fetch(endpoint, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error in deleting ingredient.");
            }
            else {
                alert("Ingredient deletion successful.");
                location.reload();
            }
            return response;
        })
        .catch(error => {
        console.log("catch error", error);
        
    });

}
document.getElementById("updateBtn").addEventListener("click", function () {
    const selectElement = document.getElementById("ingredientList");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const ingredientId = selectedOption.value; // Corrected to .value

    if (ingredientId === "Please Select") { // Assuming the placeholder option's value is "Please Select"
        alert("Please select a valid ingredient to update.");
        return;
    }

    // Always fetch ingredient details when the update button is clicked
    getIngredientInfo();

    // Toggle the visibility of the update section
    const visible = document.getElementById("updateSection");
    visible.style.display = (visible.style.display === "none" || visible.style.display === "") ? "block" : "none";
});

document.getElementById('mealQueryBtn').addEventListener('click', function () {
    window.location.href = '/Stock/MealQuery'; // Replace with your actual path or URL
});

document.getElementById("saveUpdateBtn").addEventListener("click", updateIngredient);
document.getElementById("deleteBtn").addEventListener("click", deleteIngredient);
