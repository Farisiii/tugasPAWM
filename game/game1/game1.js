const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const startBtn = document.getElementById('startBtn')
const checkBtn = document.getElementById('checkBtn')
const scoreElement = document.getElementById('score')
const exitBtn = document.getElementById('exitBtn') // New button reference

const wordPairs = [
  { id: 'rumah', en: 'house' },
  { id: 'kucing', en: 'cat' },
  { id: 'anjing', en: 'dog' },
  { id: 'buku', en: 'book' },
  { id: 'meja', en: 'table' },
  { id: 'kursi', en: 'chair' },
  { id: 'pintu', en: 'door' },
  { id: 'jendela', en: 'window' },
  { id: 'mobil', en: 'car' },
  { id: 'pohon', en: 'tree' },
]

let currentWord = null
let score = 0
let gameActive = false
let userInput = ''
let inputActive = false
let cursorVisible = true
let cursorInterval

// Add confirmation dialog for exit
function confirmExit() {
  if (gameActive) {
    const confirmDialog = document.createElement('div')
    confirmDialog.className = 'confirm-dialog'
    confirmDialog.innerHTML = `
      <div class="confirm-content">
        <p>Are you sure you want to exit?</p>
        <p>Your current score is: ${score}</p>
        <div class="confirm-buttons">
          <button id="confirmYes">Yes</button>
          <button id="confirmNo">No</button>
        </div>
      </div>
    `
    document.body.appendChild(confirmDialog)

    document.getElementById('confirmYes').addEventListener('click', () => {
      window.location.href = '../../choiceGame/choiceGame.html'
    })

    document.getElementById('confirmNo').addEventListener('click', () => {
      document.body.removeChild(confirmDialog)
    })
  } else {
    window.location.href = '../../choiceGame/choiceGame.html'
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    confirmExit()
  }
})

function resizeCanvas() {
  const container = document.querySelector('.game-container')
  const containerWidth = container.clientWidth - 40
  const aspectRatio = 3 / 2

  canvas.style.width = containerWidth + 'px'
  canvas.style.height = containerWidth / aspectRatio + 'px'

  canvas.width = containerWidth
  canvas.height = containerWidth / aspectRatio
}

function drawInitialMessage() {
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const fontSize = Math.max(16, Math.min(30, canvas.width / 20))

  ctx.fillStyle = '#2c3e50'
  ctx.font = `${fontSize}px Arial`
  ctx.textAlign = 'center'
  ctx.fillText(
    'Click Start Game to begin!',
    canvas.width / 2,
    canvas.height / 2
  )
}

function drawBackground() {
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const fontSize = Math.max(16, Math.min(30, canvas.width / 20))
  ctx.font = `${fontSize}px Arial`
}

function drawWord() {
  const fontSize = Math.max(16, Math.min(30, canvas.width / 20))
  ctx.fillStyle = '#2c3e50'
  ctx.font = `${fontSize}px Arial`
  ctx.textAlign = 'center'
  ctx.fillText(
    `Translate: ${currentWord.id}`,
    canvas.width / 2,
    canvas.height * 0.3
  )

  if (inputActive) {
    ctx.fillStyle = '#34495e'
    ctx.font = `${fontSize * 0.8}px Arial`
    // Only show cursor when cursorVisible is true
    const displayText = userInput + (cursorVisible ? '|' : ' ')
    ctx.fillText(displayText, canvas.width / 2, canvas.height * 0.5)
  }
}

function startCursorBlink() {
  if (cursorInterval) {
    clearInterval(cursorInterval)
  }

  cursorInterval = setInterval(() => {
    cursorVisible = !cursorVisible
    drawBackground()
    drawWord()
  }, 500) // Blink every 500ms
}

function stopCursorBlink() {
  if (cursorInterval) {
    clearInterval(cursorInterval)
    cursorInterval = null
  }
  cursorVisible = true
}

function startGame() {
  gameActive = true
  inputActive = true
  userInput = ''
  currentWord = wordPairs[Math.floor(Math.random() * wordPairs.length)]
  drawBackground()
  drawWord()
  startCursorBlink()
}

function checkAnswer() {
  if (!gameActive) return

  stopCursorBlink()

  if (userInput.toLowerCase().trim() === currentWord.en.toLowerCase()) {
    score += 10
    scoreElement.textContent = score

    const fontSize = Math.max(16, Math.min(30, canvas.width / 20))
    ctx.fillStyle = '#27ae60'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText('Correct! +10 points', canvas.width / 2, canvas.height * 0.7)
  } else {
    const fontSize = Math.max(16, Math.min(30, canvas.width / 20))
    ctx.fillStyle = '#c0392b'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText(
      `Wrong! Correct answer: ${currentWord.en}`,
      canvas.width / 2,
      canvas.height * 0.7
    )
  }

  setTimeout(() => {
    startGame()
  }, 2000)
}

canvas.addEventListener('click', () => {
  if (gameActive) {
    inputActive = true
    drawBackground()
    drawWord()
  }
})

document.addEventListener('keydown', (e) => {
  if (!inputActive || !gameActive) return

  if (e.key === 'Enter') {
    checkAnswer()
  } else if (e.key === 'Backspace') {
    userInput = userInput.slice(0, -1)
  } else if (e.key.length === 1) {
    userInput += e.key
  }

  drawBackground()
  drawWord()
})

startBtn.addEventListener('click', startGame)
checkBtn.addEventListener('click', checkAnswer)
exitBtn.addEventListener('click', confirmExit) // Add exit button listener

window.addEventListener('load', () => {
  resizeCanvas()
  drawInitialMessage()
})

window.addEventListener('resize', () => {
  resizeCanvas()
  if (!gameActive) {
    drawInitialMessage()
  } else {
    drawBackground()
    drawWord()
  }
})

window.addEventListener('beforeunload', () => {
  stopCursorBlink()
})

drawInitialMessage()
