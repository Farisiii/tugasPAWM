class WordGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas')
    this.ctx = this.canvas.getContext('2d')
    this.startButton = document.getElementById('startButton')
    this.checkButton = document.getElementById('checkButton')
    this.scoreElement = document.getElementById('score')
    this.timeElement = document.getElementById('time')
    this.modalOverlay = document.getElementById('modalOverlay')
    this.finalScoreElement = document.getElementById('finalScore')
    this.matchedWordsElement = document.getElementById('matchedWords')
    this.totalWordsElement = document.getElementById('totalWords')
    this.playAgainButton = document.getElementById('playAgainButton')
    this.gameContainer = document.querySelector('.game-container')
    this.homeButton = document.getElementById('homeButton')
    this.exitModalOverlay = document.getElementById('exitModalOverlay')
    this.confirmExitButton = document.getElementById('confirmExitButton')
    this.cancelExitButton = document.getElementById('cancelExitButton')

    this.wordPairs = [
      ['apple', 'apel'],
      ['cat', 'kucing'],
      ['dog', 'anjing'],
      ['house', 'rumah'],
      ['book', 'buku'],
      ['car', 'mobil'],
      ['bird', 'burung'],
    ]

    this.englishWords = []
    this.indonesianWords = []
    this.score = 0
    this.timeLeft = 60
    this.gameInterval = null
    this.gameStarted = false
    this.selectedWord = null
    this.connections = []
    this.currentLine = null
    this.canInteract = true
    this.resizeTimeout = null
    this.resizeDelay = 100

    this.initializeEventListeners()
    this.initializeExitHandlers()
    this.resizeCanvas()
    this.totalWordsElement.textContent = this.wordPairs.length
  }

  initializeEventListeners() {
    window.addEventListener('resize', () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout)
      }

      this.resizeTimeout = setTimeout(() => {
        this.handleResize()
      }, this.resizeDelay)
    })
    this.startButton.addEventListener('click', () => this.startGame())
    this.checkButton.addEventListener('click', () => {
      if (this.gameStarted) this.checkAnswers()
    })
    this.playAgainButton.addEventListener('click', () => this.hideModal())

    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e))
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e))
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e))
  }

  initializeExitHandlers() {
    this.homeButton.addEventListener('click', () => this.handleExitAttempt())
    this.confirmExitButton.addEventListener('click', () => this.exitGame())
    this.cancelExitButton.addEventListener('click', () => this.hideExitModal())

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.exitModalOverlay.classList.contains('visible')) {
          this.hideExitModal()
        } else if (this.gameStarted) {
          this.handleExitAttempt()
        }
      }
    })
  }

  handleResize() {
    const container = document.querySelector('.game-container')
    const maxWidth = Math.min(container.clientWidth - 40, 1000)
    const aspectRatio = 3 / 2

    // Store current game state
    const previousState = {
      gameStarted: this.gameStarted,
      connections: [...this.connections],
      score: this.score,
      timeLeft: this.timeLeft,
    }

    // Update canvas dimensions
    this.canvas.width = maxWidth
    this.canvas.height = maxWidth / aspectRatio

    // Recalculate word positions while maintaining connections
    if (this.gameStarted) {
      this.updateWordPositions()

      // Restore game state
      this.gameStarted = previousState.gameStarted
      this.connections = previousState.connections
      this.score = previousState.scoreF
      this.timeLeft = previousState.timeLeft

      // Redraw everything
      this.drawGame()
    }
  }

  handleExitAttempt() {
    if (this.gameStarted) {
      // If game is in progress, show confirmation
      this.showExitModal()
    } else {
      // If no game in progress, exit directly
      this.exitGame()
    }
  }

  updateWordPositions() {
    const wordWidth = this.canvas.width * 0.2
    const wordHeight = this.canvas.height * 0.08
    const padding = this.canvas.height * 0.03
    const columnWidth = this.canvas.width / 3

    // Update English words positions
    this.englishWords.forEach((word, index) => {
      word.width = wordWidth
      word.height = wordHeight
      word.x = columnWidth - wordWidth - padding
      word.y = this.canvas.height * 0.15 + index * (wordHeight + padding)
    })

    // Update Indonesian words positions
    this.indonesianWords.forEach((word, index) => {
      word.width = wordWidth
      word.height = wordHeight
      word.x = 2 * columnWidth + padding
      word.y = this.canvas.height * 0.15 + index * (wordHeight + padding)
    })
  }

  showExitModal() {
    this.gameContainer.classList.add('blur')
    this.exitModalOverlay.classList.add('visible')
    this.canInteract = false

    // Pause the game timer
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
    }
  }

  showModal(correctCount) {
    this.gameContainer.classList.add('blur')
    this.finalScoreElement.textContent = this.score
    this.matchedWordsElement.textContent = correctCount
    this.modalOverlay.classList.add('visible')
  }

  showGameResultModal(correctCount) {
    this.gameContainer.classList.add('blur')

    // Update konten modal
    this.finalScoreElement.textContent = this.score
    this.matchedWordsElement.textContent = correctCount

    // Tambahkan informasi waktu yang tersisa
    const modalContent = document.querySelector('.modal-content')
    const timeInfoElement = document.createElement('p')
    timeInfoElement.innerHTML = `Time remaining: <span style="color: #2196f3; font-weight: bold;">${this.timeLeft}s</span>`
    modalContent.insertBefore(timeInfoElement, modalContent.lastElementChild)

    // Tambahkan bonus score berdasarkan waktu tersisa
    const timeBonus = Math.floor(this.timeLeft * 0.5) // 0.5 poin per detik tersisa
    const bonusElement = document.createElement('p')
    bonusElement.innerHTML = `Time bonus: <span style="color: #4caf50; font-weight: bold;">+${timeBonus}</span>`
    modalContent.insertBefore(bonusElement, modalContent.lastElementChild)

    // Update total score dengan bonus
    this.score += timeBonus
    this.finalScoreElement.textContent = this.score

    // Tambahkan pesan motivasi
    const motivationElement = document.createElement('p')
    motivationElement.style.marginTop = '1rem'
    motivationElement.style.fontStyle = 'italic'
    if (correctCount === this.wordPairs.length) {
      motivationElement.textContent = "🎉 Perfect! You're amazing!"
    } else if (correctCount >= this.wordPairs.length * 0.7) {
      motivationElement.textContent = '👏 Great job! Keep practicing!'
    } else {
      motivationElement.textContent =
        '💪 Nice try! You can do better next time!'
    }
    modalContent.appendChild(motivationElement)

    this.modalOverlay.classList.add('visible')
  }

  hideExitModal() {
    this.exitModalOverlay.classList.remove('visible')
    this.gameContainer.classList.remove('blur')
    this.canInteract = true

    // Resume the game timer if game was in progress
    if (this.gameStarted) {
      this.startTimer()
    }
  }

  hideModal() {
    this.modalOverlay.classList.remove('visible')
    this.gameContainer.classList.remove('blur')

    // Reset dan mulai game baru
    this.resetGameState()
    this.canInteract = true
    this.startGame()

    // Bersihkan elemen tambahan di modal
    const modalContent = document.querySelector('.modal-content')
    while (modalContent.children.length > 3) {
      modalContent.removeChild(modalContent.lastChild)
    }
  }

  resizeCanvas() {
    this.handleResize()
  }

  initializeGame() {
    this.resetGameState()
    this.createWords()
    this.drawGame()
  }

  exitGame() {
    // Clean up any game state
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
    }

    // Navigate to the home page
    window.location.href = '../../choiceGame/choiceGame.html'
  }

  resetGameState() {
    this.englishWords = []
    this.indonesianWords = []
    this.connections = []
    this.score = 0
    this.timeLeft = 60
    this.selectedWord = null
    this.currentLine = null
    this.scoreElement.textContent = this.score
    this.timeElement.textContent = this.timeLeft
  }

  createWords() {
    const shuffledPairs = [...this.wordPairs].sort(() => Math.random() - 0.5)
    const shuffledIndonesian = [...shuffledPairs].sort(
      () => Math.random() - 0.5
    )

    const wordWidth = this.canvas.width * 0.2
    const wordHeight = this.canvas.height * 0.08
    const padding = this.canvas.height * 0.03
    const columnWidth = this.canvas.width / 3

    // Clear existing words
    this.englishWords = []
    this.indonesianWords = []

    shuffledPairs.forEach((pair, index) => {
      const x = columnWidth - wordWidth - padding
      const y = this.canvas.height * 0.15 + index * (wordHeight + padding)
      this.englishWords.push(
        new Word(x, y, wordWidth, wordHeight, pair[0], true)
      )
    })

    shuffledIndonesian.forEach((pair, index) => {
      const x = 2 * columnWidth + padding
      const y = this.canvas.height * 0.15 + index * (wordHeight + padding)
      this.indonesianWords.push(
        new Word(x, y, wordWidth, wordHeight, pair[1], false)
      )
    })
  }

  drawGame() {
    this.clearCanvas()
    this.drawColumns()
    this.drawConnections()
    this.drawCurrentLine()
    this.drawWords()
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawColumns() {
    this.ctx.fillStyle = '#f8f9fa'
    this.ctx.fillRect(0, 0, this.canvas.width / 3, this.canvas.height)
    this.ctx.fillRect(
      (2 * this.canvas.width) / 3,
      0,
      this.canvas.width / 3,
      this.canvas.height
    )

    this.ctx.fillStyle = '#333'
    this.ctx.font = `bold ${this.canvas.width * 0.03}px 'Segoe UI'`
    this.ctx.textAlign = 'center'
    this.ctx.fillText(
      'English',
      this.canvas.width / 6,
      this.canvas.height * 0.08
    )
    this.ctx.fillText(
      'Indonesian',
      (5 * this.canvas.width) / 6,
      this.canvas.height * 0.08
    )
  }

  drawConnections() {
    this.connections.forEach((conn) => {
      this.ctx.beginPath()
      this.ctx.moveTo(
        conn.start.x + conn.start.width,
        conn.start.y + conn.start.height / 2
      )
      this.ctx.lineTo(conn.end.x, conn.end.y + conn.end.height / 2)
      this.ctx.strokeStyle = conn.isCorrect ? '#4caf50' : '#FFA726'
      this.ctx.lineWidth = 2
      this.ctx.stroke()
    })
  }

  drawCurrentLine() {
    if (this.currentLine) {
      this.ctx.beginPath()
      this.ctx.moveTo(this.currentLine.startX, this.currentLine.startY)
      this.ctx.lineTo(this.currentLine.endX, this.currentLine.endY)
      this.ctx.strokeStyle = '#ff6b6b'
      this.ctx.lineWidth = 2
      this.ctx.stroke()
    }
  }

  drawWords() {
    ;[...this.englishWords, ...this.indonesianWords].forEach((word) =>
      word.draw(this.ctx)
    )
  }

  startGame() {
    if (!this.gameStarted) {
      this.gameStarted = true
      this.initializeGame()
      this.startButton.textContent = 'Restart Game'
      this.startTimer()
      this.canInteract = true
    } else {
      clearInterval(this.gameInterval)
      this.gameStarted = false
      this.startGame()
    }
  }

  startTimer() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
    }

    this.gameInterval = setInterval(() => {
      this.timeLeft--
      this.timeElement.textContent = this.timeLeft
      if (this.timeLeft <= 0) this.endGame(false)
    }, 1000)
  }

  endGame(won) {
    clearInterval(this.gameInterval)
    this.gameStarted = false

    let correctCount = this.connections.filter((conn) => conn.isCorrect).length

    if (!won) {
      this.showModal(correctCount)
    } else {
      this.showModal(correctCount)
    }

    this.startButton.textContent = 'Start Game'
  }

  checkAnswers() {
    this.canInteract = false // Nonaktifkan interaksi
    clearInterval(this.gameInterval) // Hentikan timer

    let correctCount = 0
    this.connections.forEach((conn) => {
      const isCorrect = this.wordPairs.some(
        (pair) => pair[0] === conn.start.word && pair[1] === conn.end.word
      )

      conn.isCorrect = isCorrect
      conn.start.isCorrect = isCorrect
      conn.end.isCorrect = isCorrect

      if (isCorrect) correctCount++
    })

    this.score = correctCount * 10
    this.scoreElement.textContent = this.score
    this.drawGame()

    this.showGameResultModal(correctCount)
  }

  getMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  handleMouseDown(e) {
    if (!this.gameStarted || !this.canInteract) return

    const { x, y } = this.getMousePosition(e)
    const clickedWord = [...this.englishWords, ...this.indonesianWords].find(
      (word) => word.contains(x, y)
    )

    if (clickedWord) {
      this.selectedWord = clickedWord
      this.currentLine = {
        startX: clickedWord.isEnglish
          ? clickedWord.x + clickedWord.width
          : clickedWord.x,
        startY: clickedWord.y + clickedWord.height / 2,
        endX: x,
        endY: y,
      }
    }
  }

  handleMouseMove(e) {
    if (!this.canInteract) return

    const { x, y } = this.getMousePosition(e)
    this.currentLine.endX = x
    this.currentLine.endY = y
    this.drawGame()
  }

  handleMouseUp(e) {
    if (!this.canInteract) return

    const { x, y } = this.getMousePosition(e)
    const releasedWord = [...this.englishWords, ...this.indonesianWords].find(
      (word) => word.contains(x, y)
    )

    if (releasedWord && releasedWord !== this.selectedWord) {
      this.makeConnection(this.selectedWord, releasedWord)
    }

    this.selectedWord = null
    this.currentLine = null
    this.drawGame()
  }

  makeConnection(word1, word2) {
    if (word1.isEnglish === word2.isEnglish) return false

    const existingConnection = this.connections.find(
      (conn) =>
        conn.start === word1 ||
        conn.end === word1 ||
        conn.start === word2 ||
        conn.end === word2
    )

    if (existingConnection) {
      this.connections = this.connections.filter(
        (conn) => conn !== existingConnection
      )
      existingConnection.start.isMatched = false
      existingConnection.end.isMatched = false
    }

    const isCorrectMatch = this.wordPairs.some(
      (pair) =>
        (pair[0] === word1.word && pair[1] === word2.word) ||
        (pair[1] === word1.word && pair[0] === word2.word)
    )

    word1.isMatched = true
    word2.isMatched = true
    this.connections.push({
      start: word1.isEnglish ? word1 : word2,
      end: word1.isEnglish ? word2 : word1,
      isCorrect: isCorrectMatch,
    })

    return true
  }
}

class Word {
  constructor(x, y, width, height, word, isEnglish) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.word = word
    this.isEnglish = isEnglish
    this.isMatched = false
    this.isCorrect = false
  }

  draw(ctx) {
    // Draw word box with rounded corners
    ctx.fillStyle = this.isCorrect
      ? '#e8f5e9'
      : this.isMatched
      ? '#fff3e0'
      : '#ffffff'
    ctx.strokeStyle = this.isCorrect
      ? '#4caf50'
      : this.isMatched
      ? '#FFA726'
      : '#4169E1'
    ctx.lineWidth = 2

    // Create rounded rectangle
    ctx.beginPath()
    const radius = 10
    ctx.moveTo(this.x + radius, this.y)
    ctx.lineTo(this.x + this.width - radius, this.y)
    ctx.quadraticCurveTo(
      this.x + this.width,
      this.y,
      this.x + this.width,
      this.y + radius
    )
    ctx.lineTo(this.x + this.width, this.y + this.height - radius)
    ctx.quadraticCurveTo(
      this.x + this.width,
      this.y + this.height,
      this.x + this.width - radius,
      this.y + this.height
    )
    ctx.lineTo(this.x + radius, this.y + this.height)
    ctx.quadraticCurveTo(
      this.x,
      this.y + this.height,
      this.x,
      this.y + this.height - radius
    )
    ctx.lineTo(this.x, this.y + radius)
    ctx.quadraticCurveTo(this.x, this.y, this.x + radius, this.y)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    // Draw word text
    ctx.fillStyle = '#333333'
    ctx.font = `${this.width * 0.15}px 'Segoe UI'`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.word, this.x + this.width / 2, this.y + this.height / 2)
  }

  contains(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    )
  }

  updateDimensions(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  const game = new WordGame()
})
