// ... existing code ...

/**
 * Inline search in navbar implementation
 */
function initInlineSearch() {
    // Search elements
    const searchForm = document.getElementById('navbar-search-form');
    const searchInput = document.getElementById('navbar-search-input');
    const searchResults = document.getElementById('search-results-dropdown');
    
    let searchData = null;
    
    // Load search data
    loadSearchData();
    
    // Handle search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query.length > 0) {
                performSearch(query);
            } else {
                hideResults();
            }
        });
    }
    
    // Handle input changes for real-time search
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length >= 2) {
                performSearch(query);
            } else {
                hideResults();
            }
        });
        
        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target) && !searchResults.contains(e.target)) {
                hideResults();
            }
        });
        
        // Focus and blur events for better UX
        searchInput.addEventListener('focus', function() {
            if (this.value.trim().length >= 2) {
                showResults();
            }
        });
    }
    
    function hideResults() {
        searchResults.classList.remove('active');
    }
    
    function showResults() {
        searchResults.classList.add('active');
    }
    
    function loadSearchData() {
        // In a real application, this might fetch data from an API
        // For this example, we'll use predefined data
        searchData = {
            articles: [
                {
                    id: 'article1',
                    title: '10 Måter å Redusere Kodens Karbonavtrykk',
                    excerpt: 'Lær praktiske teknikker for å skrive energieffektiv kode som reduserer miljøpåvirkning uten å ofre funksjonalitet.',
                    type: 'article',
                    url: 'index.html#article1-modal',
                    category: 'Energieffektivitet'
                },
                {
                    id: 'article2',
                    title: 'Bærekraftige Webdesign-Prinsipper for Utviklere',
                    excerpt: 'Utforsk hvordan bærekraftig webdesign kan redusere energiforbruk samtidig som det forbedrer brukeropplevelse og tilgjengelighet.',
                    type: 'article',
                    url: 'index.html#article2-modal',
                    category: 'Beste Praksis'
                },
                {
                    id: 'article3',
                    title: '5 Verktøy for å Måle Kodens Miljøpåvirkning',
                    excerpt: 'Oppdag verktøy og målemetoder som kan hjelpe deg med å vurdere og forbedre miljøavtrykket til dine programvareprosjekter.',
                    type: 'article',
                    url: 'index.html#article3-modal',
                    category: 'Verktøy'
                }
            ],
            tools: [
                {
                    id: 'carbon-calculator',
                    title: 'Karbonfotavtrykk-Kalkulator',
                    excerpt: 'Beregn miljøpåvirkningen av dine nettsteder basert på størrelse, kompleksitet og serverplassering.',
                    type: 'tool',
                    url: 'verktoy.html#carbon-calculator',
                    category: 'Verktøy'
                },
                {
                    id: 'framework',
                    title: 'Rammeverk for Grønn Programmering',
                    excerpt: 'En strukturert tilnærming for å utvikle programvare med minimal miljøpåvirkning.',
                    type: 'tool',
                    url: 'verktoy.html#framework-section',
                    category: 'Verktøy'
                },
                {
                    id: 'checklist',
                    title: 'Sjekkliste for Grønn Programmering',
                    excerpt: 'En omfattende sjekkliste for å sikre at ditt prosjekt følger beste praksis for miljøvennlig utvikling.',
                    type: 'tool',
                    url: 'verktoy.html#checklist-section',
                    category: 'Verktøy'
                }
            ],
            forum: [
                {
                    id: 'forum1',
                    title: 'Erfaringer med energieffektiv JavaScript',
                    excerpt: 'Del dine erfaringer med å optimalisere JavaScript-kode for å redusere energiforbruk.',
                    type: 'forum',
                    url: 'forum.html',
                    category: 'Energieffektivitet'
                },
                {
                    id: 'forum2',
                    title: 'Grønne hosting-alternativer i Norge',
                    excerpt: 'Diskusjon om hvilke hostingleverandører i Norge som bruker fornybar energi.',
                    type: 'forum',
                    url: 'forum.html',
                    category: 'Bærekraftig Praksis'
                },
                {
                    id: 'forum3',
                    title: 'Spørsmål om Website Carbon Calculator',
                    excerpt: 'Hvordan tolker man resultatene fra Website Carbon Calculator?',
                    type: 'forum',
                    url: 'forum.html',
                    category: 'Verktøy & Ressurser'
                }
            ]
        };
    }
    
    function performSearch(query) {
        if (!searchData) {
            loadSearchData();
        }
        
        query = query.toLowerCase();
        let results = [];
        
        // Search in all categories at once - no filters in the inline search
        results = results.concat(searchData.articles.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.excerpt.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        ));
        
        results = results.concat(searchData.tools.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.excerpt.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        ));
        
        results = results.concat(searchData.forum.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.excerpt.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        ));
        
        // Limit to 6 results for the dropdown
        results = results.slice(0, 6);
        
        displayResults(results);
    }
    
    function displayResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p>Ingen resultater funnet.</p>
                </div>
            `;
            showResults();
            return;
        }
        
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            let typeClass = '';
            let typeText = '';
            
            switch (result.type) {
                case 'article':
                    typeClass = 'article';
                    typeText = 'Artikkel';
                    break;
                case 'tool':
                    typeClass = 'tool';
                    typeText = 'Verktøy';
                    break;
                case 'forum':
                    typeClass = 'forum';
                    typeText = 'Forum';
                    break;
            }
            
            resultItem.innerHTML = `
                <a href="${result.url}">
                    <h4>${result.title}</h4>
                    <p>${result.excerpt}</p>
                    <div class="result-meta">
                        <span class="result-type ${typeClass}">${typeText}</span>
                        <span>${result.category}</span>
                    </div>
                </a>
            `;
            
            searchResults.appendChild(resultItem);
        });
        
        showResults();
    }
}

// Initialize the inline search when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // If the original search function exists, keep it
    if (typeof initSearchFunctionality === 'function') {
        initSearchFunctionality();
    }
    
    // Initialize the inline search
    initInlineSearch();
});
