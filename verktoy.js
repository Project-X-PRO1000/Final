document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tools
    initCarbonCalculator();
    initChecklist();

    // Carbon Calculator Tool
    function initCarbonCalculator() {
        const calculatorForm = document.getElementById('carbon-calculator-form');
        const resultSection = document.getElementById('carbon-result');
        
        if (calculatorForm) {
            calculatorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const url = document.getElementById('website-url').value;
                const complexity = document.getElementById('page-complexity').value;
                const serverLocation = document.getElementById('server-location').value;
                const monthlyVisits = parseInt(document.getElementById('monthly-visits').value);
                
                // Calculate carbon footprint (simplified simulation)
                const results = calculateCarbonFootprint(url, complexity, serverLocation, monthlyVisits);
                
                // Display results
                displayCarbonResults(results);
                
                // Show result section with animation
                resultSection.classList.add('visible');
                
                // Scroll to results
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }
    
    function calculateCarbonFootprint(url, complexity, serverLocation, monthlyVisits) {
        // This is a simplified model for demonstration purposes
        
        // Base CO2 per visit in grams
        let co2PerVisit = 0;
        
        // Adjust based on complexity
        switch(complexity) {
            case 'low':
                co2PerVisit = 0.2;
                break;
            case 'medium':
                co2PerVisit = 1.5;
                break;
            case 'high':
                co2PerVisit = 3.0;
                break;
        }
        
        // Adjust based on server energy source
        let energyFactor = 1.0;
        switch(serverLocation) {
            case 'renewable':
                energyFactor = 0.5;
                break;
            case 'mixed':
                energyFactor = 1.0;
                break;
            case 'fossil':
                energyFactor = 2.0;
                break;
        }
        
        co2PerVisit *= energyFactor;
        
        // Calculate monthly and yearly emissions
        const monthlyCO2 = co2PerVisit * monthlyVisits;
        const yearlyCO2 = monthlyCO2 * 12;
        
        // Estimate energy consumption in watt-hours
        const energyConsumption = co2PerVisit * 0.25; // Simplified conversion
        
        // Environmental score (0-100, where 100 is best)
        const environmentalScore = Math.max(0, Math.min(100, 100 - (co2PerVisit * 30)));
        
        // Generate recommendations based on results
        const recommendations = generateRecommendations(complexity, serverLocation, environmentalScore);
        
        return {
            co2PerVisit,
            monthlyCO2,
            yearlyCO2,
            energyConsumption,
            environmentalScore,
            recommendations,
            url
        };
    }
    
    function displayCarbonResults(results) {
        // Set URL
        document.getElementById('analyzed-url').textContent = 'Analysert URL: ' + results.url;
        
        // Set values
        document.getElementById('co2-per-visit').textContent = results.co2PerVisit.toFixed(2) + ' g';
        document.getElementById('monthly-emissions').textContent = (results.monthlyCO2 / 1000).toFixed(2) + ' kg';
        document.getElementById('yearly-emissions').textContent = (results.yearlyCO2 / 1000).toFixed(2) + ' kg';
        document.getElementById('energy-consumption').textContent = results.energyConsumption.toFixed(3) + ' Wh';
        
        // Update scale position (0% = good, 100% = bad)
        const scalePosition = 100 - results.environmentalScore;
        document.getElementById('eco-scale').style.left = scalePosition + '%';
        
        // Set recommendations
        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = '';
        
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });
    }
    
    function generateRecommendations(complexity, serverLocation, score) {
        const recommendations = [];
        
        if (score < 70) {
            recommendations.push('Vurder å velge en hostingleverandør som bruker fornybar energi.');
        }
        
        if (complexity === 'high') {
            recommendations.push('Reduser sidens kompleksitet ved å optimalisere eller fjerne tunge elementer som store bilder, animasjoner eller videoer.');
            recommendations.push('Implementer lazy loading for innhold som ikke er synlig ved første lasting.');
        }
        
        if (serverLocation === 'fossil') {
            recommendations.push('Flytt tjenesten til en leverandør med grønnere energikilder.');
        }
        
        // Add some standard recommendations
        recommendations.push('Komprimer bilder og andre medieressurser for å redusere sidens størrelse.');
        recommendations.push('Bruk caching effektivt for å redusere unødvendige serverforespørsler.');
        recommendations.push('Vurder å implementere statisk generering hvor mulig.');
        
        return recommendations;
    }

    // Checklist Tool
    function initChecklist() {
        const checklistItems = document.querySelectorAll('.checklist-item input');
        const saveButton = document.getElementById('save-checklist');
        const resetButton = document.getElementById('reset-checklist');
        
        // Load saved state from localStorage
        loadChecklistState();
        
        // Add event listeners to all checkboxes
        checklistItems.forEach(item => {
            item.addEventListener('change', function() {
                updateChecklistProgress();
            });
        });
        
        // Save button
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                saveChecklistState();
                showNotification('Sjekkliste lagret!');
            });
        }
        
        // Reset button
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                if (confirm('Er du sikker på at du vil nullstille hele sjekklisten?')) {
                    resetChecklistState();
                    showNotification('Sjekkliste nullstilt', 'fa-exclamation-circle');
                }
            });
        }
        
        // Initial progress update
        updateChecklistProgress();
    }
    
    function updateChecklistProgress() {
        const totalItems = document.querySelectorAll('.checklist-item input').length;
        const checkedItems = document.querySelectorAll('.checklist-item input:checked').length;
        
        // Update counter
        document.getElementById('checklist-completed').textContent = checkedItems;
        document.getElementById('checklist-total').textContent = totalItems;
        
        // Update progress bar
        const progressPercentage = (totalItems > 0) ? (checkedItems / totalItems) * 100 : 0;
        document.getElementById('checklist-progress').style.width = progressPercentage + '%';
    }
    
    function saveChecklistState() {
        const checklistState = {};
        
        document.querySelectorAll('.checklist-item input').forEach(item => {
            const category = item.getAttribute('data-category');
            const value = item.getAttribute('value');
            const key = `${category}-${value}`;
            checklistState[key] = item.checked;
        });
        
        localStorage.setItem('greenCodeChecklist', JSON.stringify(checklistState));
    }
    
    function loadChecklistState() {
        const savedState = localStorage.getItem('greenCodeChecklist');
        
        if (savedState) {
            const checklistState = JSON.parse(savedState);
            
            document.querySelectorAll('.checklist-item input').forEach(item => {
                const category = item.getAttribute('data-category');
                const value = item.getAttribute('value');
                const key = `${category}-${value}`;
                
                if (checklistState[key] !== undefined) {
                    item.checked = checklistState[key];
                }
            });
        }
    }
    
    function resetChecklistState() {
        document.querySelectorAll('.checklist-item input').forEach(item => {
            item.checked = false;
        });
        
        localStorage.removeItem('greenCodeChecklist');
        updateChecklistProgress();
    }
});
