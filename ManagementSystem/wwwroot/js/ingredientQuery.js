document.addEventListener('DOMContentLoaded', function () {
    fetchIngredients();
    setupModalTrigger();
});

function setupModalTrigger() {
    // Setting up Pop up tab
    var btn = document.getElementById('addIngredientBtn');
    var modal = document.getElementById('ingredientModal');
    var span = document.getElementsByClassName('close-button')[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    };

    // Close the modal if the user clicks outside of it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

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

function populateIngredients(ingredients) {
    const selectElement = document.getElementById('ingredientList');

    ingredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.id = ingredient.ingredientId;
        option.textContent = ingredient.name;
        selectElement.appendChild(option);
    });
}

function updateIngredient() {
    const selectElement = document.getElementById("ingredientList")
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const ingredientId = selectedOption.id;

    const endpoint = `https://localhost:44342/api/Ingredients/${ingredientId}`

    fetch(endpoint)
    .then(response => {
        if (!response.ok) {
            throw new Error("could not complete request")
        }
        response.json()
    })
    .then(ingredient => {
        // Assuming you want to populate fields in your modal, you'd do something like this:
        document.getElementById('name').textContent = ingredient.name;
        document.getElementById('calories').value = ingredient.calories;
        document.getElementById('salt').value = ingredient.salt;
        document.getElementById('fat').value = ingredient.fat;
        document.getElementById('quantity').value = ingredient.quantity;
        document.getElementById('ingredientModal').style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });

}
document.getElementById("updateBtn").addEventListener("click", updateIngredient);
