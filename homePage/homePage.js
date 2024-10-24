const burger = document.getElementById('burger')
const sidebar = document.getElementById('sidebar')
const navbar = document.getElementById('navbar')
const closeSidebar = document.getElementById('close-sidebar')
const addSetButton = document.getElementById('add-set-button')
const addSetModal = document.getElementById('add-set-modal')
const cancelAddSet = document.getElementById('cancel-add-set')
const addSetForm = document.getElementById('add-set-form')
const mainContent = document.querySelector('.container')
const submitButton = document.querySelector('.submit-button')
const setContainer = document.querySelector('.sets-grid')
const setNameInput = document.getElementById('set-name')
const studyDurInput = document.getElementById('study-duration')
const mainContainer = document.querySelector('.container')
const flashcardContainer = document.querySelector('.flashcard-container')
const flashcard = document.querySelector('.flashcard')
const frontCardText = document.querySelector('.front-card-text')
const backCardText = document.querySelector('.back-card-text')
const hafalButton = document.querySelector('.hafal-btn')
const belumButton = document.querySelector('.belum-btn')
const deleteSetModal = document.getElementById('delete-set-modal')
const cancelDelete = document.getElementById('cancel-delete')
let currentSetIndex = null

let dataCardDummy = [
  { bahasaInggris: 'eat', bahasaIndonesia: 'makan' },
  { bahasaInggris: 'drink', bahasaIndonesia: 'minum' },
  { bahasaInggris: 'sleep', bahasaIndonesia: 'tidur' },
  { bahasaInggris: 'run', bahasaIndonesia: 'lari' },
  { bahasaInggris: 'walk', bahasaIndonesia: 'jalan' },
]

let dataSetDummy = [
  {
    name: 'Kuliah',
    item: 5,
    hafal: 0,
    hari: 1,
    cards: [
      { bahasaInggris: 'eat', bahasaIndonesia: 'makan' },
      { bahasaInggris: 'drink', bahasaIndonesia: 'minum' },
      { bahasaInggris: 'sleep', bahasaIndonesia: 'tidur' },
      { bahasaInggris: 'run', bahasaIndonesia: 'lari' },
      { bahasaInggris: 'walk', bahasaIndonesia: 'jalan' },
    ],
  },
]

let numberCard = 0
let belumHafal = []
let sudahHafal = []
let hafal = 0

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }
})

const createSetCard = (name, item, hafal, hari, index) => {
  const newCard = document.createElement('div')
  newCard.className = 'set-card'
  newCard.dataset.setIndex = index // Add this line to store the index
  newCard.innerHTML = `
    <div class="set-header">
      <h3 class="set-title">Set ${index + 1} ${name}</h3>
      <button class="delete-button" aria-label="Delete set">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="set-stats">
      <div class="stat">
        <span class="stat-value">${item}</span>
        <span class="stat-label">Item</span>
      </div>
      <div class="stat">
        <span class="stat-value percentage">0%</span>
        <span class="stat-label">Hafal</span>
      </div>
      <div class="stat">
        <span class="stat-value">${hari}</span>
        <span class="stat-label">Hari</span>
      </div>
    </div>
  `

  document.querySelector('.sets-grid').appendChild(newCard)
}

// update sets-grid
const updateDisplayHome = () => {
  dataSetDummy.forEach((set, index) => {
    createSetCard(set.name, set.item, set.hafal, set.hari, index)
  })
}

updateDisplayHome()

burger.addEventListener('click', () => {
  sidebar.classList.toggle('open')
})

closeSidebar.addEventListener('click', () => {
  sidebar.classList.remove('open')
})

// Close sidebar when clicking outside
document.addEventListener('click', (event) => {
  if (
    sidebar.classList.contains('open') &&
    !sidebar.contains(event.target) &&
    !burger.contains(event.target)
  ) {
    sidebar.classList.remove('open')
  }
})

// Close sidebar when resizing to larger screen
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove('open')
  }
})

// Open add set modal
addSetButton.addEventListener('click', () => {
  addSetModal.style.display = 'block'
  mainContent.classList.add('blur')
})

// Close add set modal
cancelAddSet.addEventListener('click', () => {
  addSetModal.style.display = 'none'
  mainContent.classList.remove('blur')
})

// Handle form submission
addSetForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Close the modal and remove blur effect
  addSetModal.style.display = 'none'
  mainContent.classList.remove('blur')

  // Reset the form
  addSetForm.reset()
})

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === addSetModal) {
    addSetModal.style.display = 'none'
    mainContent.classList.remove('blur')
  }
})

// menambah elemen
submitButton.addEventListener('click', () => {
  if (setNameInput.value && studyDurInput.value) {
    createSetCard(
      setNameInput.value,
      0,
      0,
      studyDurInput.value,
      dataSetDummy.length
    )

    dataSetDummy.push({
      name: setNameInput.value,
      item: 0,
      hafal: 0,
      hari: studyDurInput.value,
      cards: [],
    })
  }
})

const cardDisplay = () => {
  frontCardText.innerHTML = dataCardDummy[numberCard].bahasaInggris
  backCardText.innerHTML = dataCardDummy[numberCard].bahasaIndonesia
}

const eventCardBtn = () => {
  if (numberCard >= dataCardDummy.length - 1) {
    navbar.style.display = 'flex'
    sidebar.style.display = 'block'
    mainContainer.style.display = 'block'
    flashcardContainer.style.display = 'none'
    numberCard = 0

    dataCardDummy = dataCardDummy.filter(
      (_, index) => !sudahHafal.includes(index)
    )
    document.querySelector('.percentage').textContent = `${
      (sudahHafal.length * 100) / 5
    }%`

    // hal yang dilakukan ke data belumHafal

    // // Reset sudahHafal dan belumHafal
    // sudahHafal = []
    // belumHafal = []
  } else {
    numberCard += 1
    cardDisplay()
  }
}

// Add click event for set cards
document.querySelectorAll('.set-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (dataCardDummy.length > 0) {
      navbar.style.display = 'none'
      sidebar.style.display = 'none'
      mainContainer.style.display = 'none'
      flashcardContainer.style.display = 'flex'
      cardDisplay()
    }
  })
})

// Flip card on click
flashcard.addEventListener('click', () => {
  flashcard.classList.toggle('flipped')
})

// hafal button event
hafalButton.addEventListener('click', () => {
  sudahHafal.push(numberCard)
  eventCardBtn()
})

belumButton.addEventListener('click', () => {
  belumHafal.push(numberCard)
  eventCardBtn()
})

// Add this function to handle set deletion
const deleteSet = (index) => {
  dataSetDummy.splice(index, 1)
  document.querySelector('.sets-grid').innerHTML = ''
  updateDisplayHome()
}

// Add event delegation for delete buttons
setContainer.addEventListener('click', (e) => {
  const deleteButton = e.target.closest('.delete-button')
  if (deleteButton) {
    e.stopPropagation() // Prevent set card click event
    const setCard = deleteButton.closest('.set-card')
    currentSetIndex = parseInt(setCard.dataset.setIndex)
    deleteSetModal.style.display = 'block'
    mainContent.classList.add('blur')
  }
})

// Handle delete confirmation
document
  .querySelector('.delete-confirm-button')
  .addEventListener('click', () => {
    if (currentSetIndex !== null) {
      deleteSet(currentSetIndex)
      currentSetIndex = null
    }
    deleteSetModal.style.display = 'none'
    mainContent.classList.remove('blur')
  })

// Handle delete cancellation
cancelDelete.addEventListener('click', () => {
  deleteSetModal.style.display = 'none'
  mainContent.classList.remove('blur')
  currentSetIndex = null
})

// Close delete modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === deleteSetModal) {
    deleteSetModal.style.display = 'none'
    mainContent.classList.remove('blur')
    currentSetIndex = null
  }
})

// Update the existing event listener for set cards to check if delete button was clicked
document.querySelectorAll('.set-card').forEach((card) => {
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.delete-button') && dataCardDummy.length > 0) {
      navbar.style.display = 'none'
      sidebar.style.display = 'none'
      mainContainer.style.display = 'none'
      flashcardContainer.style.display = 'flex'
      cardDisplay()
    }
  })
})
