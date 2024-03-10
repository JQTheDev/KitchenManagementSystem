document.addEventListener('DOMContentLoaded', function () {
    GetFunding();
});
async function UpdateFunding() {
    
    const data = {
        FundingId: 1,
        Amount: document.getElementById("govFunding").value
    };
    const endpoint = "https://localhost:44342/api/Funding/1"
    fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        
    .then(response => {
        if (!response.ok) {
            throw new Error("Unsuccesful", response.statusText)
        }
        else {
            alert("Funding successfully updated")
            return null;
        }
    })
    .catch(error => {
        console.error('Error:', error); // Handle any errors
    });

        
    
}

async function GetFunding() {
    try {
       
        const uri = "https://localhost:44342/api/Funding/1"
        const response = await fetch(uri)
        if (!response.ok) {
            throw new Error("Could not load funding");
        }
        else {
            const data = await response.json();
            document.getElementById("govFunding").value = data.amount;
        }
    }
    catch (error) {
        console.error('New error: ',error)
    }

}
document.getElementById("ingredientQueryBtn").addEventListener("click", function () {
    window.location.href = '/Stock/IngredientQuery';
});

document.getElementById("mealQueryBtn").addEventListener("click", function () {
    window.location.href = '/Stock/MealQuery';
});

document.getElementById("updateButton").addEventListener("click", UpdateFunding);
