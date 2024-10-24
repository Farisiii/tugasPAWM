class FillInTheBlankGame {
  constructor() {
    this.paragraphs = [
      {
        text: 'The beautiful sunrise painted the sky with vibrant colors as birds chirped their morning songs. A gentle breeze rustled through the trees, creating a peaceful atmosphere in the quiet neighborhood.',
        numberOfWords: 5,
      },
      {
        text: 'Technology has transformed the way we communicate and interact with each other. Social media platforms enable people to connect instantly across great distances, sharing their experiences and ideas.',
        numberOfWords: 5,
      },
      {
        text: 'Regular exercise and proper nutrition are essential for maintaining good health. Daily physical activity helps strengthen muscles and boost energy levels throughout the day.',
        numberOfWords: 5,
      },
    ]

    this.currentParagraphIndex = 0
    this.score = 0
    this.currentAnswers = new Map()
    this.draggingWord = null
    this.isChecking = false

    this.initializeElements()
    this.bindEvents()
    this.initializeGame()
  }

  initializeElements() {
    this.paragraphElement = document.getElementById('paragraph')
    this.wordBankElement = document.getElementById('wordBank')
    this.feedbackElement = document.getElementById('feedback')
    this.scoreDisplay = document.getElementById('scoreDisplay')
    this.checkButton = document.getElementById('checkButton')
    this.nextButton = document.getElementById('nextButton')
    this.exitButton = document.getElementById('exitButton')
  }

  bindEvents() {
    this.checkButton.addEventListener('click', () => this.checkAnswers())
    this.nextButton.addEventListener('click', () => this.nextParagraph())
    this.exitButton.addEventListener('click', () => this.handleExit())

    // Add keyboard shortcut for exit
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.handleExit()
      }
    })
  }

  handleExit() {
    if (this.score > 0 || this.currentAnswers.size > 0) {
      this.showExitConfirmation()
    } else {
      window.location.href = '../../choiceGame/choiceGame.html'
    }
  }

  showExitConfirmation() {
    const overlay = document.createElement('div')
    overlay.className = 'exit-overlay'

    const dialog = document.createElement('div')
    dialog.className = 'exit-dialog'
    dialog.innerHTML = `
      <h3>Exit Game?</h3>
      <p>Current Score: ${this.score}</p>
      <p>Are you sure you want to exit?</p>
      <div class="exit-buttons">
        <button class="exit-yes">Yes</button>
        <button class="exit-no">No</button>
      </div>
    `

    overlay.appendChild(dialog)
    document.body.appendChild(overlay)

    const handleYes = () => {
      window.location.href = '../../choiceGame/choiceGame.html'
    }

    const handleNo = () => {
      document.body.removeChild(overlay)
    }

    dialog.querySelector('.exit-yes').addEventListener('click', handleYes)
    dialog.querySelector('.exit-no').addEventListener('click', handleNo)
  }

  // Function to get random words from text
  getRandomWords(text, numWords) {
    // Split text into words and filter out empty strings and short words
    const words = text.split(' ').filter(
      (word) =>
        word.length > 3 && // Only words longer than 3 characters
        !word.includes('.') && // Exclude words with punctuation
        !word.includes(',') &&
        !/^\d+$/.test(word) // Exclude numbers
    )

    // Shuffle the array of words
    const shuffled = this.shuffleArray(words)

    // Return the specified number of words or all words if numWords > available words
    return shuffled.slice(0, Math.min(numWords, shuffled.length))
  }

  shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  createWord(text) {
    const wordElement = document.createElement('div')
    wordElement.className = 'word'
    wordElement.textContent = text
    wordElement.draggable = true

    wordElement.addEventListener('dragstart', (e) => {
      if (!this.isChecking) {
        this.draggingWord = e.target
        e.target.classList.add('dragging')
      }
    })

    wordElement.addEventListener('dragend', (e) => {
      e.target.classList.remove('dragging')
      this.draggingWord = null
    })

    return wordElement
  }

  createBlankSpace(index, word) {
    const blank = document.createElement('span')
    blank.className = 'blank-space'
    blank.dataset.id = index
    blank.dataset.word = word

    blank.addEventListener('dragover', (e) => {
      e.preventDefault()
      if (!this.isChecking) {
        e.currentTarget.style.borderStyle = 'solid'
      }
    })

    blank.addEventListener('dragleave', (e) => {
      e.currentTarget.style.borderStyle = 'dashed'
    })

    blank.addEventListener('drop', (e) => {
      e.preventDefault()
      if (this.draggingWord && !this.isChecking) {
        const word = this.draggingWord.textContent
        this.currentAnswers.set(parseInt(blank.dataset.id), word)
        blank.textContent = word
        blank.classList.add('filled')
        blank.style.borderStyle = 'dashed'
        this.draggingWord.remove()
      }
    })

    blank.addEventListener('click', () => {
      if (blank.classList.contains('incorrect') && blank.textContent) {
        const word = this.createWord(blank.textContent)
        this.wordBankElement.appendChild(word)

        blank.textContent = ''
        blank.classList.remove('filled', 'incorrect')
        this.currentAnswers.delete(parseInt(blank.dataset.id))
      }
    })

    return blank
  }

  initializeGame() {
    this.paragraphElement.innerHTML = ''
    this.wordBankElement.innerHTML = ''
    this.feedbackElement.className = 'feedback'
    this.feedbackElement.textContent = ''
    this.currentAnswers.clear()
    this.isChecking = false

    const currentParagraph = this.paragraphs[this.currentParagraphIndex]
    const words = currentParagraph.text.split(' ')

    // Get random words to remove for this paragraph
    const wordsToRemove = this.getRandomWords(
      currentParagraph.text,
      currentParagraph.numberOfWords
    )

    // Store the selected words for checking answers later
    currentParagraph.wordsToRemove = wordsToRemove

    // Create paragraph with blanks
    words.forEach((word, index) => {
      if (wordsToRemove.includes(word)) {
        const blank = this.createBlankSpace(index, word)
        this.paragraphElement.appendChild(blank)
      } else {
        this.paragraphElement.appendChild(document.createTextNode(word))
      }
      this.paragraphElement.appendChild(document.createTextNode(' '))
    })

    // Create word bank with shuffled words
    const shuffledWords = this.shuffleArray(wordsToRemove)
    shuffledWords.forEach((word) => {
      this.wordBankElement.appendChild(this.createWord(word))
    })
  }

  async checkAnswers() {
    if (this.isChecking) return

    this.isChecking = true
    const currentParagraph = this.paragraphs[this.currentParagraphIndex]
    let allCorrect = true

    const blanks = document.querySelectorAll('.blank-space')
    blanks.forEach((blank) => {
      const position = parseInt(blank.dataset.id)
      const answer = this.currentAnswers.get(position)
      const correct = blank.dataset.word

      if (answer !== correct) {
        allCorrect = false
        blank.classList.add('incorrect')
      } else {
        blank.classList.add('filled')
      }
    })

    if (
      allCorrect &&
      this.currentAnswers.size === currentParagraph.wordsToRemove.length
    ) {
      this.score += 10
      this.scoreDisplay.textContent = this.score
      this.showFeedback(
        'success',
        'Excellent! All words are correct! +10 points'
      )

      await new Promise((resolve) => setTimeout(resolve, 3000))
      this.nextParagraph()
    } else {
      this.showFeedback(
        'error',
        'Some words are not correct. Click on incorrect words to return them to the word bank.'
      )
      this.isChecking = false
    }
  }

  showFeedback(type, message) {
    this.feedbackElement.className = `feedback ${type} visible`
    this.feedbackElement.textContent = message
  }

  nextParagraph() {
    if (!this.isChecking) {
      this.currentParagraphIndex =
        (this.currentParagraphIndex + 1) % this.paragraphs.length
      this.initializeGame()
    }
  }
}

// Initialize the game
const game = new FillInTheBlankGame()
