// Initialize AOS animations
AOS.init({ once:true });

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));

// Typing Effect
const roles = ["Front-End", "RaSmosSne", "Cyber"];
let i = 0, currentText = '', isDeleting = false;
const typingEl = document.getElementById('typing');

function type() {
    const fullText = roles[i];
    
    if(isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
    } else {
        currentText = fullText.substring(0, currentText.length + 1);
    }
    
    typingEl.textContent = currentText;
    
    let typeSpeed = isDeleting ? 100 : 200;
    
    if(!isDeleting && currentText === fullText) {
        typeSpeed = 1000;
        isDeleting = true;
    } else if(isDeleting && currentText === '') {
        isDeleting = false;
        i = (i + 1) % roles.length;
        typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
}

window.addEventListener('load', type);

// Progress bars animation
const progressBars = document.querySelectorAll('.progress');

function showProgress() {
    progressBars.forEach(bar => {
        const value = bar.getAttribute('data-skill');
        const pos = bar.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        if(pos < screenHeight - 100) {
            bar.style.width = value + '%';
        }
    });
}

window.addEventListener('scroll', showProgress);
window.addEventListener('load', showProgress);

// Dark Mode Toggle
const toggleBtn = document.getElementById("darkModeToggle");
const body = document.body;

// Check saved theme
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.textContent = "Light Mode";
}

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    toggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Timeline animation
const timelineItems = document.querySelectorAll('.timeline-item');
const timeline = document.querySelector('.timeline');

function checkTimeline() {
    const timelinePos = timeline.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;
    
    if(timelinePos < screenHeight - 100) {
        timeline.classList.add('line-active');
        
        timelineItems.forEach((item, i) => {
            setTimeout(() => {
                item.classList.add('show');
            }, i * 300);
        });
    }
}

window.addEventListener('scroll', checkTimeline);
window.addEventListener('load', checkTimeline);

// English Exam Functionality
const takeExamBtn = document.getElementById('take-exam-btn');
const examModal = document.getElementById('exam-modal');
const closeExamBtn = document.getElementById('close-exam-btn');
const closeResultsBtn = document.getElementById('close-results-btn');

// Show English Exam when button is clicked
takeExamBtn.addEventListener('click', function() {
    examModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Close exam modal
closeExamBtn.addEventListener('click', function() {
    examModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close results and exam
closeResultsBtn.addEventListener('click', function() {
    examModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
examModal.addEventListener('click', function(e) {
    if (e.target === examModal) {
        examModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Store correct answers for scoring
const correctAnswers = {
    // Section 1: Reading (10 marks)
    q1_1: 'D', q1_2: 'C', q1_3: 'F', q1_4: 'K', q1_5: 'H',
    q1_6: 'J', q1_7: 'A', q1_8: 'B', q1_9: 'I', q1_10: 'G', q1_11: 'E',
    
    // Section 2: Language Use (6 marks)
    q2_1: 'e', q2_2: 'h', q2_3: 'a', q2_4: 'c', 
    q2_5: 'b', q2_6: 'd', q2_7: 'f',
    
    // Section 3: Grammar (11 marks)
    q3_1: 'B', q3_2: 'C', q3_3: 'A', q3_4: 'B', q3_5: 'B',
    q3_6: 'A', q3_7: 'B', q3_8: 'B', q3_9: 'B', q3_10: 'D',
    q3_11: 'D', q3_12: 'D',
    
    // Section 4: Vocabulary (7 marks)
    q4_1: 'B', q4_2: 'B', q4_3: 'A', q4_4: 'A', 
    q4_5: 'D', q4_6: 'D', q4_7: 'A', q4_8: 'A'
};

// Function to check answers and provide feedback
function checkAnswer(element, correctAnswer) {
    // Remove any existing feedback for this question
    const existingFeedback = element.parentNode.querySelector('.feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    
    // Check if answer is correct
    if (element.value === correctAnswer) {
        feedback.classList.add('correct');
        feedback.textContent = 'Correct! Well done.';
    } else {
        feedback.classList.add('incorrect');
        feedback.textContent = 'Incorrect. Please try again.';
        
        // Provide specific feedback based on the question
        if (element.type === 'radio') {
            const questionText = element.parentNode.parentNode.querySelector('p').textContent;
            if (questionText.includes('eat any more')) {
                feedback.textContent = 'Incorrect. "Full" means you have eaten enough, while "fed up" means you are bored or annoyed.';
            } else if (questionText.includes('secret')) {
                feedback.textContent = 'Incorrect. The correct expression is "keep a secret".';
            } else if (questionText.includes('mug')) {
                feedback.textContent = 'Incorrect. When we are missing one item, we say we are "one short".';
            }
        }
    }
    
    // Insert feedback after the options
    if (element.type === 'radio') {
        element.parentNode.appendChild(feedback);
    } else if (element.tagName === 'SELECT') {
        element.parentNode.appendChild(feedback);
    }
    
    // Show the feedback
    feedback.style.display = 'block';
}

// Function to calculate and display the score
function submitExam() {
    let section1Score = 0;
    let section2Score = 0;
    let section3Score = 0;
    let section4Score = 0;
    
    // Calculate Section 1 score (10 marks)
    for (let i = 1; i <= 11; i++) {
        const questionId = `q1_${i}`;
        const selectedValue = document.getElementById(questionId).value;
        if (selectedValue === correctAnswers[questionId]) {
            section1Score++;
        }
    }
    
    // Calculate Section 2 score (6 marks)
    for (let i = 1; i <= 7; i++) {
        const questionId = `q2_${i}`;
        const selectedValue = document.getElementById(questionId).value;
        if (selectedValue === correctAnswers[questionId]) {
            section2Score++;
        }
    }
    
    // Calculate Section 3 score (11 marks)
    for (let i = 1; i <= 12; i++) {
        const questionId = `q3_${i}`;
        const selectedElement = document.querySelector(`input[name="q3_${i}"]:checked`);
        if (selectedElement && selectedElement.value === correctAnswers[questionId]) {
            section3Score++;
        }
    }
    
    // Calculate Section 4 score (7 marks)
    for (let i = 1; i <= 8; i++) {
        const questionId = `q4_${i}`;
        const selectedElement = document.querySelector(`input[name="q4_${i}"]:checked`);
        if (selectedElement && selectedElement.value === correctAnswers[questionId]) {
            section4Score++;
        }
    }
    
    // Calculate total score
    const totalScore = section1Score + section2Score + section3Score + section4Score;
    
    // Display results
    document.getElementById('totalScore').textContent = `Total Score: ${totalScore}/34`;
    
    // Section 1
    const section1Percent = Math.round((section1Score / 10) * 100);
    document.getElementById('section1Score').textContent = `${section1Score}/10 (${section1Percent}%)`;
    document.getElementById('section1Progress').style.width = `${section1Percent}%`;
    
    // Section 2
    const section2Percent = Math.round((section2Score / 6) * 100);
    document.getElementById('section2Score').textContent = `${section2Score}/6 (${section2Percent}%)`;
    document.getElementById('section2Progress').style.width = `${section2Percent}%`;
    
    // Section 3
    const section3Percent = Math.round((section3Score / 11) * 100);
    document.getElementById('section3Score').textContent = `${section3Score}/11 (${section3Percent}%)`;
    document.getElementById('section3Progress').style.width = `${section3Percent}%`;
    
    // Section 4
    const section4Percent = Math.round((section4Score / 7) * 100);
    document.getElementById('section4Score').textContent = `${section4Score}/7 (${section4Percent}%)`;
    document.getElementById('section4Progress').style.width = `${section4Percent}%`;
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}
