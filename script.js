function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayQuestions(questions) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';

        const questionText = document.createElement('h3');
        questionText.textContent = `${index + 1}. ${decodeHTML(question.question)}`;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        const allOptions = [
            ...question.incorrect_answers,
            question.correct_answer
        ];
        const shuffledOptions = shuffleArray(allOptions);

        shuffledOptions.forEach(option => {
            const optionButton = document.createElement('div');
            optionButton.className = 'option';
            optionButton.textContent = decodeHTML(option);
            optionButton.addEventListener('click', () => {
                const allOptions = optionsDiv.querySelectorAll('.option');
                allOptions.forEach(opt => {
                    opt.style.pointerEvents = 'none';
                    if (opt.textContent === decodeHTML(question.correct_answer)) {
                        opt.classList.add('correct');
                    } else if (opt === optionButton) {
                        opt.classList.add('incorrect');
                    }
                });
            });
            optionsDiv.appendChild(optionButton);
        });

        questionDiv.appendChild(questionText);
        questionDiv.appendChild(optionsDiv);
        container.appendChild(questionDiv);
    });
}

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=11&type=multiple');
        const data = await response.json();
        if (data.response_code === 0) {
            displayQuestions(data.results);
        } else {
            throw new Error('Failed to fetch questions');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('quiz-container').innerHTML = 
            '<p>Error loading questions. Please try again.</p>';
    }
}

document.getElementById('fetchQuestions').addEventListener('click', fetchQuestions);
// Load initial questions
fetchQuestions();