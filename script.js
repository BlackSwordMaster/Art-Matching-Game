class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.scoreBoard = document.getElementById('score'); // Score display
        this.score = 0; // Initial score set to 0
    }

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        this.score = 0; // Reset score at the start of the game

        setTimeout(() => {
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500);

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
        this.updateScore(); // Reset score display at the start
    }

    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) this.gameOver();
        }, 1000);
    }

    gameOver() {
        clearInterval(this.countdown);
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countdown);
        this.score += this.timeRemaining * 10; // 🏆 Bonus: Add 10 points per second left
        this.updateScore();
        document.getElementById('victory-text').classList.add('visible');
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

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

            this.score -= 5; //  Deduct 5 points for every flip (to discourage random clicking)
            this.updateScore();
        }
    }

    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card, this.cardToCheck);
        } else {
            this.cardMismatch(card, this.cardToCheck);
        }
        this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');

        this.score += 100; // Add 100 points for a correct match
        this.updateScore();

        if (this.matchedCards.length === this.cardsArray.length) this.victory();
    }

    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }

    getCardType(card) {
        let cardValue = card.getElementsByClassName('card-value')[0];

        if (cardValue.tagName === "IMG") {
            return cardValue.getAttribute('data-type'); // Get the artist name from artwork
        } else {
            return cardValue.getAttribute('data-type'); // Get the artist name from text
        }
    }

    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }

    updateScore() {
        this.scoreBoard.innerText = this.score; // Update the score in the UI
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}