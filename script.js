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

      function animateBinary(element, maxHeight) {
        let pos = parseFloat(element.style.top);
        const speed = 0.5 + Math.random() * 1.5;

        function frame() {
          pos += speed;
          if (pos > maxHeight) {
            pos = -100;
          }
          element.style.top = pos + "px";
          requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
      }

      // Quiz functionality
      const quizQuestions = [
        {
          question:
            "Which of the following coding practices contributes most to reducing energy consumption?",
          options: [
            "Minimizing HTTP requests in web applications",
            "Using dark mode UI by default",
            "Implementing efficient algorithms with lower complexity",
            "All of the above",
          ],
          answer: 3,
        },
        {
          question:
            "What is the environmental impact of unused code in a software project?",
          options: [
            "It increases storage requirements unnecessarily",
            "It may still be executed and consume CPU resources",
            "It needs to be transmitted over networks increasing bandwidth usage",
            "All of the above",
          ],
          answer: 3,
        },
        {
          question:
            "Which of these hosting options generally has the lowest carbon footprint?",
          options: [
            "Self-hosted servers in your office",
            "Cloud providers who use renewable energy",
            "Any cloud provider regardless of energy source",
            "Dedicated servers in a data center",
          ],
          answer: 1,
        },
        {
          question: "What is 'digital sobriety' in green coding?",
          options: [
            "Using fewer animations and visual effects",
            "Minimizing resource usage and implementing only necessary features",
            "Writing code while avoiding caffeine",
            "Using muted color schemes in user interfaces",
          ],
          answer: 1,
        },
        {
          question:
            "Which file format is typically more energy-efficient for web images?",
          options: [
            "High-resolution PNG",
            "Uncompressed TIFF",
            "Optimized WebP or AVIF",
            "Standard JPEG with no optimization",
          ],
          answer: 2,
        },
      ];

      let currentQuestion = 0;
      let userAnswers = [];

      function loadQuestion(index) {
        const question = quizQuestions[index];
        document.getElementById("question-text").textContent =
          question.question;

        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = "";

        question.options.forEach((option, i) => {
          const optionDiv = document.createElement("div");
          optionDiv.className = "option";
          if (userAnswers[index] === i) {
            optionDiv.className += " selected";
          }
          optionDiv.setAttribute("data-index", i);
          optionDiv.textContent = option;
          optionsContainer.appendChild(optionDiv);
        });

        // Update progress bar
        const progressBar = document.getElementById("quiz-progress");
        progressBar.style.width = `${
          ((index + 1) / quizQuestions.length) * 100
        }%`;

        // Update buttons
        document.getElementById("prev-btn").disabled = index === 0;
        const nextBtn = document.getElementById("next-btn");
        if (index === quizQuestions.length - 1) {
          nextBtn.textContent = "Finish";
        } else {
          nextBtn.textContent = "Next";
        }
      }

      function showResult() {
        const quizContent = document.querySelector(".quiz-content");
        const quizResult = document.getElementById("quiz-result");

        quizContent.style.display = "none";
        quizResult.style.display = "block";

        // Calculate score
        let score = 0;
        userAnswers.forEach((answer, index) => {
          if (answer === quizQuestions[index].answer) {
            score++;
          }
        });

        document.getElementById(
          "quiz-score"
        ).textContent = `${score}/${quizQuestions.length}`;

        const resultMessage = document.getElementById("result-message");
        const percentage = (score / quizQuestions.length) * 100;

        if (percentage >= 80) {
          resultMessage.textContent =
            "Excellent! You're a green coding expert!";
        } else if (percentage >= 60) {
          resultMessage.textContent =
            "Good job! You have solid knowledge of green coding practices.";
        } else {
          resultMessage.textContent =
            "Keep learning! Check out our blog for more information on green coding.";
        }
      }

      // Modal functionality
      function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = "flex";
      }

      function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = "none";
      }

      // Event Listeners
      document.addEventListener("DOMContentLoaded", function () {
        // Initialize binary background
        createBinaryBackground();

        // Load first question
        loadQuestion(0);

        // Quiz event listeners
        document
          .getElementById("options-container")
          .addEventListener("click", function (e) {
            if (e.target.classList.contains("option")) {
              // Remove selected class from all options
              const options = document.querySelectorAll(".option");
              options.forEach((option) => option.classList.remove("selected"));

              // Add selected class to clicked option
              e.target.classList.add("selected");

              // Save answer
              userAnswers[currentQuestion] = parseInt(
                e.target.getAttribute("data-index")
              );
            }
          });

        document
          .getElementById("prev-btn")
          .addEventListener("click", function () {
            if (currentQuestion > 0) {
              currentQuestion--;
              loadQuestion(currentQuestion);
            }
          });

        document
          .getElementById("next-btn")
          .addEventListener("click", function () {
            if (currentQuestion < quizQuestions.length - 1) {
              currentQuestion++;
              loadQuestion(currentQuestion);
            } else {
              showResult();
            }
          });

        document
          .getElementById("restart-quiz")
          .addEventListener("click", function () {
            currentQuestion = 0;
            userAnswers = [];
            document.querySelector(".quiz-content").style.display = "block";
            document.getElementById("quiz-result").style.display = "none";
            loadQuestion(0);
          });

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
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            // Simulate login (no backend)
            alert(`Login successful!\nWelcome back, ${email}`);
            closeModal("login-modal");

            // Update UI to show logged in state
            document.getElementById("login-btn").style.display = "none";
            document.getElementById("register-btn").textContent = "Logout";
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

            // Simulate registration (no backend)
            alert(`Registration successful!\nWelcome to GreenCode, ${name}!`);
            closeModal("register-modal");

            // Update UI to show logged in state
            document.getElementById("login-btn").style.display = "none";
            document.getElementById("register-btn").textContent = "Logout";
          });

        // Newsletter form
        document
          .querySelector(".newsletter-form")
          .addEventListener("submit", function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing to our newsletter with ${email}!`);
            this.reset();
          });

        // Close modals when clicking outside
        window.addEventListener("click", function (e) {
          if (e.target.classList.contains("modal")) {
            e.target.style.display = "none";
          }
        });
      });