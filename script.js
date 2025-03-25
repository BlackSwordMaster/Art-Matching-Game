// ===========================================
// MIX OR MATCH - Memory Game Class
// ===========================================
class MixOrMatch {
    constructor(totalTime, cards) {
        // Timer settings
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;

        // Game elements
        this.cardsArray = cards;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;

        // DOM elements for display
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.scoreBoard = document.getElementById('score');
        this.score = 0;
    }

    // Start or restart the game
    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        this.score = 0;

        // Shuffle and start countdown after short delay
        setTimeout(() => {
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500);

        // Reset visual and score displays
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
        this.updateScore();
    }

    // ⏱ Start the countdown timer
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;

            if (this.timeRemaining === 0) this.gameOver();
        }, 1000);
    }

    // Show game over screen
    gameOver() {
        clearInterval(this.countdown);
        document.getElementById('game-over-text').classList.add('visible');
    }

    // Show victory screen + bonus score
    victory() {
        clearInterval(this.countdown);
        this.score += this.timeRemaining * 10; // Bonus: time left × 10
        this.updateScore();
        document.getElementById('victory-text').classList.add('visible');
    }

    // Hide all cards (reset state)
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    // Handle a card being clicked/flipped
    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }

            // Penalty for guessing randomly
            this.score -= 5;
            this.updateScore();
        }
    }

    // Check if two cards match
    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card, this.cardToCheck);
        } else {
            this.cardMismatch(card, this.cardToCheck);
        }

        this.cardToCheck = null;
    }

    // Handle a successful match
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');

        this.score += 100;
        this.updateScore();

        if (this.matchedCards.length === this.cardsArray.length) {
            this.victory();
        }
    }

    // Handle mismatched cards
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    // Shuffle cards using Fisher-Yates algorithm
    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }

    // Identify a card's type (based on artist data)
    getCardType(card) {
        let cardValue = card.getElementsByClassName('card-value')[0];

        // Could be text (span) or image (img)
        return cardValue.getAttribute('data-type');
    }

    // Check if card is flippable (not matched or already flipped)
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }

    // Update the score display
    updateScore() {
        this.scoreBoard.innerText = this.score;
    }
}

// ===========================================
// Game Initialization
// ===========================================

// Ensure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// Set up the game and UI interactions
function ready() {
    const overlays = Array.from(document.getElementsByClassName('overlay-text'));
    const cards = Array.from(document.getElementsByClassName('card'));
    const game = new MixOrMatch(100, cards);

    // Click overlay to start/restart game
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    // Flip card when clicked
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}