document.getElementById('tracker-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const electricity = document.getElementById('electricity').value;
    const water = document.getElementById('water').value;
    const waste = document.getElementById('waste').value;

    const carbonFootprint = calculateCarbonFootprint(electricity, water, waste);
    const recommendations = generateRecommendations(electricity, water, waste, carbonFootprint);

    document.getElementById('impact').textContent = `Your estimated carbon footprint is ${carbonFootprint} kg CO2.`;
    const recommendationsList = document.getElementById('recommendations');
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });

    document.getElementById('result').classList.remove('hidden');

    // Check if the server is reachable
    fetch('http://localhost:3000/test')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

    // Send form data to the server
    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ electricity, water, waste })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});

function calculateCarbonFootprint(electricity, water, waste) {
    const electricityFactor = 0.527; // kg CO2 per kWh
    const waterFactor = 0.001; // kg CO2 per liter
    const wasteFactor = 1.5; // kg CO2 per kg

    const total = (electricity * electricityFactor) + (water * waterFactor) + (waste * wasteFactor);
    return total.toFixed(2);
}

function generateRecommendations(electricity, water, waste, carbonFootprint) {
    const recommendations = [];

    if (electricity > 100) {
        recommendations.push('Reduce your electricity usage by turning off lights and electronics when not in use.');
    }
    if (water > 200) {
        recommendations.push('Consider taking shorter showers to save water.');
    }
    if (waste > 5) {
        recommendations.push('Reduce waste by recycling and composting.');
    }

    if (carbonFootprint > 50) {
        recommendations.push('Consider using renewable energy sources such as solar or wind power.');
        recommendations.push('Plant trees in your community to offset carbon emissions.');
        recommendations.push('Promote carpooling and the use of public transport to reduce emissions.');
    }

    if (recommendations.length === 0) {
        recommendations.push('Great job! You are already minimizing your environmental impact.');
        recommendations.push('Continue to engage in activities like recycling, using renewable energy, and promoting sustainability.');
    }

    return recommendations;
}
