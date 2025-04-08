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
        const exportButton = document.getElementById('export-checklist');
        
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
        
        // Export to PDF button
        if (exportButton) {
            exportButton.addEventListener('click', function(e) {
                e.preventDefault();
                exportChecklistToPDF();
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
    
    // Function to export checklist to PDF
    function exportChecklistToPDF() {
        // Create a deep clone of the checklist container to modify for PDF
        const checklistContainer = document.querySelector('.checklist-container').cloneNode(true);
        
        // Add custom styles for PDF
        const style = document.createElement('style');
        style.textContent = `
            .checklist-container {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            .checklist-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #4CAF50;
                padding-bottom: 10px;
            }
            .checklist-category {
                margin-bottom: 20px;
            }
            .category-header {
                background-color: #f5f5f5;
                padding: 10px;
                margin-bottom: 10px;
                border-left: 4px solid #4CAF50;
            }
            .checklist-items {
                padding: 0 10px;
            }
            .checklist-item {
                display: block;
                margin-bottom: 8px;
                padding: 5px 0;
                border-bottom: 1px solid #eee;
            }
            .checkmark {
                display: none;
            }
            .checklist-actions {
                display: none;
            }
        `;
        
        checklistContainer.prepend(style);
        
        // Add title
        const title = document.createElement('div');
        title.style.textAlign = 'center';
        title.style.padding = '20px 0';
        
        const heading = document.createElement('h2');
        heading.textContent = 'Sjekkliste for Grønn Programmering';
        heading.style.color = '#4CAF50';
        heading.style.marginBottom = '10px';
        
        const subheading = document.createElement('p');
        subheading.textContent = 'Generert fra GreenCode';
        subheading.style.fontSize = '14px';
        subheading.style.color = '#666';
        
        const date = document.createElement('p');
        date.textContent = new Date().toLocaleDateString('no-NO', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
        date.style.fontSize = '12px';
        date.style.color = '#666';
        date.style.marginBottom = '20px';
        
        title.appendChild(heading);
        title.appendChild(subheading);
        title.appendChild(date);
        
        checklistContainer.prepend(title);
        
        // Update checkboxes to show status visually
        const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const label = checkbox.parentElement;
            
            // Get the item text
            const itemText = label.querySelector('.item-text').textContent;
            
            // Create new element for PDF
            const newItem = document.createElement('div');
            newItem.classList.add('checklist-item');
            
            // Create status indicator
            const status = document.createElement('span');
            status.style.display = 'inline-block';
            status.style.marginRight = '10px';
            status.style.width = '20px';
            status.style.height = '20px';
            status.style.textAlign = 'center';
            status.style.borderRadius = '50%';
            status.style.color = 'white';
            status.style.fontWeight = 'bold';
            
            if (checkbox.checked) {
                status.style.backgroundColor = '#4CAF50';
                status.textContent = '✓';
            } else {
                status.style.backgroundColor = '#ddd';
                status.textContent = '○';
            }
            
            // Create text element
            const text = document.createElement('span');
            text.textContent = itemText;
            if (checkbox.checked) {
                text.style.fontWeight = 'bold';
                text.style.color = '#4CAF50';
            }
            
            newItem.appendChild(status);
            newItem.appendChild(text);
            
            // Replace original label with new item
            label.parentNode.replaceChild(newItem, label);
        });
        
        // Get progress information
        const totalItems = checkboxes.length;
        const checkedItems = Array.from(checkboxes).filter(cb => cb.checked).length;
        const percentageCompleted = Math.round((checkedItems / totalItems) * 100);
        
        // Add progress information
        const progressInfo = document.createElement('div');
        progressInfo.style.textAlign = 'center';
        progressInfo.style.margin = '30px 0';
        progressInfo.style.padding = '15px';
        progressInfo.style.backgroundColor = '#f9f9f9';
        progressInfo.style.border = '1px solid #ddd';
        progressInfo.style.borderRadius = '5px';
        
        progressInfo.innerHTML = `
            <h3 style="margin-bottom: 10px; color: #333;">Fremgang</h3>
            <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">${percentageCompleted}%</div>
            <div style="margin-top: 5px; color: #666;">${checkedItems} av ${totalItems} punkter fullført</div>
        `;
        
        // Add progress info after title
        title.after(progressInfo);
        
        // Create container div for PDF generation
        const container = document.createElement('div');
        container.appendChild(checklistContainer);
        
        // PDF options
        const opt = {
            margin: [10, 10],
            filename: 'gronn_sjekkliste.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Generate and download the PDF
        html2pdf().set(opt).from(container).save()
            .then(() => {
                showNotification('Sjekkliste eksportert som PDF!', 'fa-file-pdf');
            })
            .catch(err => {
                console.error('PDF export error:', err);
                showNotification('Kunne ikke eksportere PDF. Prøv igjen.', 'fa-exclamation-circle');
            });
    }
    
    // Function to show notification
    function showNotification(message, icon = 'fa-check-circle') {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                .notification {
                    background-color: #4CAF50;
                    color: white;
                    padding: 15px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    animation: slideIn 0.3s forwards;
                    opacity: 0;
                    transform: translateX(100%);
                }
                .notification i {
                    margin-right: 10px;
                    font-size: 1.2em;
                }
                @keyframes slideIn {
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});
