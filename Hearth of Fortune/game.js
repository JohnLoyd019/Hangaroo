const questions = [
    // EASY QUESTIONS (General)
    { question: "What is the capital of France?", answer: "PARIS", difficulty: "EASY" },
    { question: "Which planet is known as the 'Red Planet'?", answer: "MARS", difficulty: "EASY" },
    { question: "What is the largest mammal on Earth?", answer: "BLUE WHALE", difficulty: "EASY" },
    { question: "What is the capital of Japan?", answer: "TOKYO", difficulty: "EASY" },
    { question: "Which country is known as the 'Land of the Rising Sun'?", answer: "JAPAN", difficulty: "EASY" },
    { question: "Who wrote 'Romeo and Juliet'?", answer: "WILLIAM SHAKESPEARE", difficulty: "EASY" },
    { question: "What is the currency of the United Kingdom?", answer: "POUND", difficulty: "EASY" },
    { question: "Which ocean is the largest?", answer: "PACIFIC", difficulty: "EASY" },
    { question: "What is the science of numbers and their operations?", answer: "MATHEMATICS", difficulty: "EASY" },
    { question: "What is anything which has mass and have space?", answer: "MATTER", difficulty: "EASY" },

    // MODERATE QUESTIONS (Programming/Computer/IT)
    { question: "In programming, what does the acronym 'HTML' stand for?", answer: "HYPERTEXT MARKUP LANGUAGE", difficulty: "MODERATE" },
    { question: "What does the acronym 'CSS' stand for in web development?", answer: "CASCADING STYLE SHEETS", difficulty: "MODERATE" },
    { question: "What is the main purpose of a firewall in network security?", answer: "PROTECT AGAINST UNAUTHORIZED ACCESS", difficulty: "MODERATE" },
    { question: "What is the default port for HTTP?", answer: "80", difficulty: "MODERATE" },
    { question: "What programming language is often used for artificial intelligence?", answer: "PYTHON", difficulty: "MODERATE" },
    { question: "What is the purpose of a 'while' loop in programming?", answer: "REPEAT CODE WHILE A CONDITION IS TRUE", difficulty: "MODERATE" },
    { question: "What is the difference between 'var', 'let', and 'const' in JavaScript?", answer: "VARIABLE DECLARATION KEYWORDS", difficulty: "MODERATE" },
    { question: "What does 'API' stand for in the context of software development?", answer: "APPLICATION PROGRAMMING INTERFACE", difficulty: "MODERATE" },
    { question: "What is the function of 'git' in version control?", answer: "TRACK CHANGES IN SOURCE CODE", difficulty: "MODERATE" },
    { question: "What does 'URL' stand for in web addresses?", answer: "UNIFORM RESOURCE LOCATOR", difficulty: "MODERATE" },

    // DIFFICULT QUESTIONS (Programming/Computer/IT)
    { question: "Describe the differences between abstraction and encapsulation in object-oriented programming.", answer: "CONCEPTS IN OOP", difficulty: "DIFFICULT" },
    { question: "Explain the concept of multithreading in computer programming.", answer: "EXECUTING MULTIPLE THREADS SIMULTANEOUSLY", difficulty: "DIFFICULT" },
    { question: "What is the purpose of a VPN in networking?", answer: "SECURE COMMUNICATION OVER A NETWORK", difficulty: "DIFFICULT" },
    { question: "What is the significance of the term 'Big-O' in algorithm analysis?", answer: "TIME AND SPACE COMPLEXITY", difficulty: "DIFFICULT" },
    { question: "What is the difference between TCP and UDP in networking?", answer: "NETWORK TRANSMISSION PROTOCOLS", difficulty: "DIFFICULT" },
    { question: "Explain the 'this' keyword in JavaScript.", answer: "REFERS TO THE OBJECT IT BELONGS TO", difficulty: "DIFFICULT" },
    { question: "What is the role of a 'package manager' in software development?", answer: "MANAGE LIBRARY DEPENDENCIES", difficulty: "DIFFICULT" },
    { question: "What is the purpose of the 'SQL' language?", answer: "MANAGE AND QUERY DATABASES", difficulty: "DIFFICULT" },
    { question: "Describe the concept of 'dependency injection' in software design.", answer: "INVERSION OF CONTROL", difficulty: "DIFFICULT" },
    { question: "What is a 'design pattern' in software development?", answer: "REUSABLE SOLUTION TO COMMON PROBLEMS", difficulty: "DIFFICULT" }
];

let currentQuestionIndex = 0;
let totalPoints = 0;
let incorrectGuesses = 0;
let selectedWord = "";
let guessedWord = [];
let heartsLeft = 3;
let clueTries = 0;

function initializeGame() {
    shuffleQuestionsByDifficulty();

    currentQuestionIndex = 0;
    totalPoints = 0;
    incorrectGuesses = 0;
    selectedWord = questions[currentQuestionIndex].answer.toUpperCase();
    guessedWord = selectedWord.split('').map(char => (char !== ' ' ? '_' : ' '));
    updateDisplay();
    renderKeyboard();
    renderAnswerDisplay();
    document.getElementById('clue-button').style.display = 'block';
    showDifficultyWarning();
    updateScoreDisplay();
    heartsLeft = 3;
    updateHeartsDisplay();
}

function shuffleQuestionsByDifficulty() {
    const easyQuestions = questions.filter(question => question.difficulty === "EASY");
    const moderateQuestions = questions.filter(question => question.difficulty === "MODERATE");
    const difficultQuestions = questions.filter(question => question.difficulty === "DIFFICULT");

    shuffleArray(easyQuestions);
    shuffleArray(moderateQuestions);
    shuffleArray(difficultQuestions);

    questions.length = 0; // Clear the original questions array

    // Concatenate the shuffled questions back into the main array
    questions.push(...easyQuestions, ...moderateQuestions, ...difficultQuestions);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateDisplay() {
    const currentQuestion = questions[currentQuestionIndex].question;
    document.getElementById('question').innerText = currentQuestion;
}

function renderAnswerDisplay() {
    const answerDisplay = document.getElementById('answer_field');
    answerDisplay.innerHTML = "";

    for (let i = 0; i < selectedWord.length; i++) {
        const letterSpan = document.createElement('span');

        if (selectedWord[i] === " ") {
            letterSpan.innerText = '\xa0'; // Use a non-breaking space
        } else {
            letterSpan.innerText = guessedWord[i] || '_';
        }

        answerDisplay.appendChild(letterSpan);

        if (selectedWord[i + 1] !== " " && i < selectedWord.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.innerText = ' ';
            answerDisplay.appendChild(spaceSpan);
        }
    }
}

function renderKeyboard() {
    const keyboardContainer = document.getElementById('keyboard');
    keyboardContainer.innerHTML = "";

    // Letter buttons (A-Z)
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const letterButton = createButton(letter);
        letterButton.addEventListener('click', () => guessLetter(letter));
        keyboardContainer.appendChild(letterButton);
    }
}

function createButton(label) {
    const button = document.createElement('div');
    button.classList.add('letter');
    button.innerText = label;

    // Store the original background color
    button.originalColor = button.style.backgroundColor;

    button.addEventListener('click', () => {
        button.style.backgroundColor = 'gray';
    });

     // Add a method to reset the button color
     button.resetColor = function() {
        this.style.backgroundColor = this.originalColor;
    };

    return button;
}

function resetButtonColors() {
    const letterButtons = document.querySelectorAll('.letter');
    letterButtons.forEach(button => button.resetColor());
}

function guessLetter(letter) {
// Check if the guessed letter is correct or incorrect
    handleGuess(letter);

// Check if the guess is incorrect and reveal the answer if it is
    if (!isLetterInWord(letter)) {
        renderAnswerDisplay();
        resetButtonColors();
    }
}

function isLetterInWord(letter) {
    // Check if the guessed letter is in the selected word
    return selectedWord.includes(letter);
}

function handleGuess(guess) {
    const currentAnswer = selectedWord;
    if (currentAnswer.includes(guess)) {
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === guess) {
                guessedWord[i] = guess;
            }
        }
        // Check if the entire word has been guessed
        if (guessedWord.join("") === selectedWord) {
            totalPoints += 10;
            // Move to the next question or end the game if needed
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                selectedWord = questions[currentQuestionIndex].answer.toUpperCase();
                guessedWord = selectedWord.split('').map(char => (char !== ' ' ? '_' : ' '));
                updateDisplay();
                renderAnswerDisplay();
                resetButtonColors();
                document.getElementById('clue-button').style.display = 'block';
                showDifficultyWarning();
                updateScoreDisplay();
            } else {
                endGame();
            }
        } else {
            renderAnswerDisplay();
        }
    } else {
        incorrectGuesses++;
        
        heartsLeft--;
        
        if (heartsLeft <= 0) {
                // End the game if no hearts left
                endGame();
            }
            
        updateHeartsDisplay();
        
        // Move to the next question or end the game if needed
        if (currentQuestionIndex >= questions.length - 1) {
                endGame();
            } else {
                currentQuestionIndex++;
                selectedWord = questions[currentQuestionIndex].answer.toUpperCase();
                guessedWord = Array(selectedWord.length).fill('_');
                updateDisplay();
                renderAnswerDisplay();
                resetButtonColors();
                document.getElementById('clue-button').style.display = 'block';
                showDifficultyWarning();
                updateScoreDisplay();
            }
    }
}

function updateHeartsDisplay() {
    for (let i = 1; i <= 3; i++) {
        const heartElement = document.getElementById(`heart${i}`);
        if (i <= heartsLeft) {
            heartElement.classList.remove('lost');
        } else {
            heartElement.classList.add('lost');
        }
    }
}

function endGame() {
    gameoverpopup();
}

// Event listener for the "Give Clue" button
function promptForClueType() {
    if (totalPoints < 25) {
        document.getElementById("nopoints").classList.toggle("active");
        return;
    }

    if (clueTries >= 3) {
        alert('You have reached the maximum number of clue tries.');
        return;
    }

    hintclue();
}

function hintclue() {
    document.getElementById("hintclue").classList.toggle("active");
}

function selectVowel() {
    giveClue('V');
    document.getElementById('hintclue').style.display = 'none';
}

function selectConsonant() {
    giveClue('C');
    document.getElementById('hintclue').style.display = 'none';
}

function gameoverpopup() {
    document.getElementById("gameover").classList.toggle("active");
}

function showCustomAlert(message) {
    document.getElementById("vowel_cosnt").classList.toggle("active");
    const alertMessage = document.getElementById("alert-message");
    document.getElementById('alert-message').style.marginTop = '2rem';
    document.getElementById('alert-message').style.marginBottom = '1.5rem';
    document.getElementById('hintclue').style.display = 'none';
    
    alertMessage.textContent = message;
    alertContent.classList.add("active");
}

// function hideCustomAlert() {
//     const alertContent = document.getElementById("alert-content");
//     alertContent.classList.remove("active");
// }

function giveClue(choice) {
    const currentAnswer = selectedWord;
    const remainingLetters = [];

    for (let i = 0; i < currentAnswer.length; i++) {
        if (guessedWord[i] !== currentAnswer[i]) {
            remainingLetters.push({ index: i, letter: currentAnswer[i] });
        }
    }

    if (remainingLetters.length > 0) {
        let randomIndex;
        let randomLetter;

        if (choice === 'C') {
            const consonants = remainingLetters.filter(letterObj => 'BCDFGHJKLMNPQRSTVWXYZ'.includes(letterObj.letter));
            if (consonants.length > 0) {
                randomIndex = Math.floor(Math.random() * consonants.length);
                randomLetter = consonants[randomIndex].letter;
                guessedWord[consonants[randomIndex].index] = randomLetter;
            } else {
                showCustomAlert("No missing consonants found.");
                return;
            }
        } else if (choice === 'V') {
            const vowels = remainingLetters.filter(letterObj => 'AEIOU'.includes(letterObj.letter));
            if (vowels.length > 0) {
                randomIndex = Math.floor(Math.random() * vowels.length);
                randomLetter = vowels[randomIndex].letter;
                guessedWord[vowels[randomIndex].index] = randomLetter;
            } else {
                showCustomAlert("No missing vowels found.");
                return;
            }
        }

        totalPoints -= 25;
        updateScoreDisplay();
        renderAnswerDisplay();

        showCustomAlert(`Clue: One of the missing letters is '${randomLetter}'.`);
    } else {
        showCustomAlert('No clue available for this word.');
    }
}

function showDifficultyWarning() {
    const difficultyWarning = document.getElementById('difficulty-warning');
    const currentDifficulty = questions[currentQuestionIndex].difficulty;

    switch (currentDifficulty) {
        case 'EASY':
            difficultyWarning.innerText = 'EASY ROUND';
            break;
        case 'MODERATE':
            difficultyWarning.innerText = 'MODERATE ROUND';
            break;
        case 'DIFFICULT':
            difficultyWarning.innerText = 'DIFFICULT ROUND';
            break;
        default:
            difficultyWarning.innerText = '';
    }
}

function updateScoreDisplay() {
    document.getElementById('points').textContent = `Points: ${totalPoints}`;
    document.getElementById('strikes').textContent = `Strikes: ${incorrectGuesses}/3`;
}

// Initialize the game on page load
window.onload = initializeGame;
