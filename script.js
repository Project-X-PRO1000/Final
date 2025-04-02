// Binary animation
function createBinaryBackground() {
  const container = document.getElementById("binary-container");
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // Create more binary columns
  for (let i = 0; i < 40; i++) {
    const binaryColumn = document.createElement("div");
    binaryColumn.className = "binary-text";

    // Position columns evenly across the width
    const left = (i / 40) * containerWidth + Math.random() * 20 - 10;
    const top = Math.random() * containerHeight - containerHeight;

    binaryColumn.style.left = `${left}px`;
    binaryColumn.style.top = `${top}px`;

    // Generate binary content with varying character brightness
    let binary = "";
    const length = 20 + Math.floor(Math.random() * 30);
    for (let j = 0; j < length; j++) {
      // Randomly add a span with brighter color for highlight effect
      if (Math.random() > 0.8) {
        binary += `<span style="color:white;text-shadow:0 0 10px #fff,0 0 20px var(--primary-green);">${Math.random() > 0.5 ? "1" : "0"}</span>`;
      } else {
        binary += Math.random() > 0.5 ? "1" : "0";
      }
    }

    binaryColumn.innerHTML = binary;
    container.appendChild(binaryColumn);

    // Animate falling with varying speeds
    animateBinary(binaryColumn, containerHeight);
  }
}

function animateBinary(element, maxHeight) {
  let pos = parseFloat(element.style.top);
  const speed = 0.5 + Math.random() * 2; // More variation in speeds
  
  // Randomize content occasionally
  const updateInterval = 5000 + Math.random() * 10000;
  const lastUpdate = Date.now();

  function frame() {
    pos += speed;
    if (pos > maxHeight) {
      pos = -100 - Math.random() * 500; // Stagger reentry
      
      // Refresh binary content occasionally
      if (Date.now() - lastUpdate > updateInterval) {
        let binary = "";
        const length = 20 + Math.floor(Math.random() * 30);
        for (let j = 0; j < length; j++) {
          if (Math.random() > 0.8) {
            binary += `<span style="color:white;text-shadow:0 0 10px #fff,0 0 20px var(--primary-green);">${Math.random() > 0.5 ? "1" : "0"}</span>`;
          } else {
            binary += Math.random() > 0.5 ? "1" : "0";
          }
        }
        element.innerHTML = binary;
      }
    }
    element.style.top = pos + "px";
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// Quiz functionality
document.addEventListener('DOMContentLoaded', function() {
  const quizQuestions = [
    {
      question: "Hvilken av følgende kodepraksis bidrar mest til å redusere energiforbruk?",
      options: [
        "Minimere HTTP-forespørsler i webapplikasjoner",
        "Bruke mørk modus som standard",
        "Implementere effektive algoritmer med lavere kompleksitet",
        "Alle de ovennevnte"
      ],
      correctAnswer: 3
    },
    {
      question: "Hvilket av følgende bildeprosesseringspraksiser er mest miljøvennlig?",
      options: [
        "Bruke høyoppløselige bilder for best kvalitet",
        "Komprimere bilder og velge riktig format (WebP, AVIF)",
        "Alltid bruke PNG-formatet for transparens",
        "Bruke store bakgrunnsbilder for estetisk appell"
      ],
      correctAnswer: 1
    },
    {
      question: "Hvorfor er serverplassering viktig for bærekraftig webpraksis?",
      options: [
        "Det påvirker bare hastigheten, ikke energiforbruket",
        "Servere i kaldt klima bruker mindre energi på kjøling",
        "Kortere datareiselengde reduserer energiforbruket",
        "Serverplassering har ingen miljøpåvirkning"
      ],
      correctAnswer: 2
    },
    {
      question: "Hvilken praksis bidrar mest til bærekraftig mobilapplikasjonutvikling?",
      options: [
        "Bruke stort antall animasjoner for bedre brukerengasjement",
        "Kontinuerlig bakgrunnsoppdatering for oppdatert informasjon",
        "Optimalisere batteriforbruk og redusere CPU-intensiv prosessering",
        "Laste ned store datamengder på forhånd for raskere respons"
      ],
      correctAnswer: 2
    },
    {
      question: "Hvilken påstand om grønn hosting er sann?",
      options: [
        "Det er alltid dyrere enn tradisjonell hosting",
        "Det reduserer ytelsesindikatorer for nettsteder",
        "Det bruker fornybare energikilder for å drive datasentre",
        "Det er bare markedsføring uten faktisk miljøinnvirkning"
      ],
      correctAnswer: 2
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let selectedOptions = [];

  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const prevButton = document.getElementById('prev-btn');
  const nextButton = document.getElementById('next-btn');
  const progressBar = document.getElementById('quiz-progress');
  const quizResult = document.getElementById('quiz-result');
  const quizScore = document.getElementById('quiz-score');
  const resultMessage = document.getElementById('result-message');
  const restartButton = document.getElementById('restart-quiz');
  const quizContent = document.querySelector('.quiz-content');

  function initializeQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedOptions = new Array(quizQuestions.length).fill(null);
    loadQuestion();
    quizContent.style.display = 'block';
    quizResult.style.display = 'none';
    updateProgressBar();
  }

  function loadQuestion() {
    const question = quizQuestions[currentQuestion];
    questionText.textContent = question.question;

    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('option');
      optionElement.dataset.index = index;
      
      // Mark the option as selected if it was previously selected
      if (selectedOptions[currentQuestion] === index) {
        optionElement.classList.add('selected');
      }
      
      optionElement.textContent = option;
      optionElement.addEventListener('click', selectOption);
      optionsContainer.appendChild(optionElement);
    });

    // Update button states
    prevButton.disabled = currentQuestion === 0;
    if (currentQuestion === quizQuestions.length - 1) {
      nextButton.textContent = 'Fullfør';
    } else {
      nextButton.textContent = 'Neste';
    }
  }

  function selectOption(event) {
    // Remove selection from all options
    const options = optionsContainer.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    
    // Add selection to clicked option
    event.target.classList.add('selected');
    
    // Store the selected option
    selectedOptions[currentQuestion] = parseInt(event.target.dataset.index);
  }

  function updateProgressBar() {
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function navigateQuestion(direction) {
    if (direction === 'prev' && currentQuestion > 0) {
      currentQuestion--;
      loadQuestion();
    } else if (direction === 'next') {
      if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        loadQuestion();
      } else {
        finishQuiz();
      }
    }
    updateProgressBar();
  }

  function finishQuiz() {
    // Calculate the score
    score = 0;
    selectedOptions.forEach((selected, index) => {
      if (selected === quizQuestions[index].correctAnswer) {
        score++;
      }
    });

    // Display results
    quizContent.style.display = 'none';
    quizResult.style.display = 'block';
    quizScore.textContent = `${score}/${quizQuestions.length}`;

    // Set appropriate message based on score
    if (score === quizQuestions.length) {
      resultMessage.textContent = 'Fantastisk! Du er en ekte grønn koding-ekspert!';
    } else if (score >= quizQuestions.length * 0.7) {
      resultMessage.textContent = 'Godt jobbet! Du har solid kunnskap om grønn koding!';
    } else if (score >= quizQuestions.length * 0.5) {
      resultMessage.textContent = 'Bra innsats! Du er på vei til å forstå grønn koding.';
    } else {
      resultMessage.textContent = 'Takk for at du tok quizen! Lær mer om grønn koding ved å utforske våre ressurser.';
    }
  }

  // Event listeners
  prevButton.addEventListener('click', () => navigateQuestion('prev'));
  nextButton.addEventListener('click', () => navigateQuestion('next'));
  restartButton.addEventListener('click', initializeQuiz);

  // Initialize quiz on page load
  initializeQuiz();
});

// Function to show notification popup
function showNotification(message, icon = 'fa-check-circle') {
  const notification = document.createElement('div');
  notification.className = 'notification-popup';
  notification.innerHTML = `
    <i class="fas ${icon}"></i>
    <span class="notification-message">${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after animation completes
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Function to handle successful login
function handleLoginSuccess(userData) {
  // Hide login/register buttons
  document.getElementById('login-btn').style.display = 'none';
  document.getElementById('register-btn').style.display = 'none';
  
  // Create user info element if it doesn't exist
  let userInfo = document.querySelector('.user-info');
  if (!userInfo) {
    userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    
    const userName = document.createElement('span');
    userName.className = 'user-name';
    userName.textContent = userData.firstName; // Set name immediately
    
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'Logg ut';
    
    // Add event listener directly to the button
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      handleLogout();
    });
    
    userInfo.appendChild(userName);
    userInfo.appendChild(logoutBtn);
    
    // Add to auth-buttons container
    document.querySelector('.auth-buttons').appendChild(userInfo);
  } else {
    // If user info exists, just update the name
    document.querySelector('.user-name').textContent = userData.firstName;
  }
  
  // Show login success notification
  showNotification(`Velkommen, ${userData.firstName}! Du har logget inn.`);
  
  // Save user data to localStorage
  localStorage.setItem('userData', JSON.stringify(userData));
}

// Function to handle logout
function handleLogout() {
  // Remove user data from localStorage
  localStorage.removeItem('userData');
  
  // Show login/register buttons
  document.getElementById('login-btn').style.display = 'block';
  document.getElementById('register-btn').style.display = 'block';
  
  // Remove user info
  const userInfo = document.querySelector('.user-info');
  if (userInfo) {
    userInfo.remove();
  }
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');
  
  // Apply blur to background elements
  document.querySelector('header').classList.add('modal-blur');
  const sections = document.querySelectorAll('section:not(.modal)');
  sections.forEach(section => section.classList.add('modal-blur'));
  document.querySelector('footer').classList.add('modal-blur');
  
  // Focus on first input in the modal
  const firstInput = modal.querySelector('input');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
  
  // Remove blur from background elements
  document.querySelector('header').classList.remove('modal-blur');
  const sections = document.querySelectorAll('section');
  sections.forEach(section => section.classList.remove('modal-blur'));
  document.querySelector('footer').classList.remove('modal-blur');
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  // Initialize binary background
  createBinaryBackground();

  // Modal event listeners
  document
    .getElementById("login-btn")
    .addEventListener("click", function () {
      openModal("login-modal");
    });

  document
    .getElementById("register-btn")
    .addEventListener("click", function () {
      openModal("register-modal");
    });

  document
    .getElementById("close-login")
    .addEventListener("click", function () {
      closeModal("login-modal");
    });

  document
    .getElementById("close-register")
    .addEventListener("click", function () {
      closeModal("register-modal");
    });

  document
    .getElementById("switch-to-register")
    .addEventListener("click", function () {
      closeModal("login-modal");
      openModal("register-modal");
    });

  document
    .getElementById("switch-to-login")
    .addEventListener("click", function () {
      closeModal("register-modal");
      openModal("login-modal");
    });

  // Handle form submissions
  document
    .getElementById("login-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      
      // Here you would normally validate credentials with your backend
      // For demonstration, we'll create a mock user
      const userData = {
        firstName: document.getElementById('login-email').value.split('@')[0], // Use part of email as firstName
        email: document.getElementById('login-email').value
      };
      
      handleLoginSuccess(userData);
      
      // Use the closeModal function to properly remove all blur effects
      closeModal("login-modal");
    });

  document
    .getElementById("register-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const confirmPassword = document.getElementById(
        "register-confirm-password"
      ).value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // Create user data
      const userData = {
        firstName: name.split(' ')[0], // Extract first name
        email: email
      };

      // Use the same login success handler
      handleLoginSuccess(userData);
      
      // Use the closeModal function to properly remove all blur effects
      closeModal("register-modal");
    });

  // Newsletter form
  document
    .querySelector(".newsletter-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      
      // Use the showNotification function instead of alert
      showNotification(`Takk for at du abonnerer på nyhetsbrevet vårt med ${email}!`, 'fa-envelope');
      
      this.reset();
    });

  // Close modals when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal")) {
      // Instead of just hiding the modal, use the closeModal function
      // to properly remove the blur effect
      const modalId = e.target.id;
      closeModal(modalId);
    }
  });

  // Article Modal Functionality
  const blogCards = document.querySelectorAll('.blog-card');
  const mainElements = document.querySelectorAll('header, section:not(.article-modal), footer');
  
  blogCards.forEach(card => {
    card.addEventListener('click', function() {
      const articleId = this.getAttribute('data-article');
      const modal = document.getElementById(`${articleId}-modal`);
      if (modal) {
        modal.style.display = 'flex'; // Display as flex for centering
        document.body.classList.add('modal-open');
        
        // Apply blur to all main content elements
        mainElements.forEach(element => {
          element.classList.add('modal-blur');
        });
      }
    });
  });
  
  const closeButtons = document.querySelectorAll('.article-modal .close-btn');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        
        // Remove blur effect
        mainElements.forEach(element => {
          element.classList.remove('modal-blur');
        });
      }
    });
  });
  
  const articleModals = document.querySelectorAll('.article-modal');
  articleModals.forEach(modal => {
    modal.addEventListener('click', function(event) {
      if (event.target === this) {
        this.style.display = 'none';
        document.body.classList.remove('modal-open');
        
        // Remove blur effect
        mainElements.forEach(element => {
          element.classList.remove('modal-blur');
        });
      }
    });
  });
  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      articleModals.forEach(modal => {
        if (window.getComputedStyle(modal).display === 'flex') {
          modal.style.display = 'none';
          document.body.classList.remove('modal-open');
          
          // Remove blur effect
          mainElements.forEach(element => {
            element.classList.remove('modal-blur');
          });
        }
      });
    }
  });

  // Check if user is already logged in when page loads
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData) {
    handleLoginSuccess(userData);
  }
});

