// Data structure (sama seperti sebelumnya)
const sets = [
  { id: '1', name: 'SET 1' },
  { id: '2', name: 'SET 2' },
  { id: '3', name: 'SET 3' },
  { id: '4', name: 'SET 4' },
  { id: '5', name: 'SET 5' },
  { id: '6', name: 'SET 6' },
  { id: '7', name: 'SET 7' },
  { id: '8', name: 'SET 8' },
  { id: '9', name: 'SET 9' },
  { id: '10', name: 'SET 10' },
]

const vocabularySets = {
  1: {
    name: 'Kuliah',
    words: [
      { indo: 'Apel', eng: 'Apple' },
      { indo: 'Pisang', eng: 'Banana' },
      { indo: 'Jeruk', eng: 'Orange' },
    ],
  },
  2: {
    name: 'Rebahan',
    words: [
      { indo: 'Kucing', eng: 'Cat' },
      { indo: 'Anjing', eng: 'Dog' },
      { indo: 'Burung', eng: 'Bird' },
    ],
  },
  3: {
    name: 'Makan',
    words: [
      { indo: 'Merah', eng: 'Red' },
      { indo: 'Biru', eng: 'Blue' },
      { indo: 'Hijau', eng: 'Green' },
    ],
  },
}

let activeButton = null
let currentSetId = null

// Initialize burger menu functionality
function initBurgerMenu() {
  const burger = document.getElementById('burger')
  const sidebar = document.getElementById('sidebar')
  const closeSidebar = document.getElementById('close-sidebar')

  burger.addEventListener('click', () => {
    sidebar.classList.add('open')
  })

  closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('open')
  })

  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !sidebar.contains(e.target) &&
      !burger.contains(e.target) &&
      sidebar.classList.contains('open')
    ) {
      sidebar.classList.remove('open')
    }
  })
}

// Initialize set buttons
function initSetButtons() {
  const container = document.getElementById('setsContainer')
  container.innerHTML = ''

  sets.forEach((set) => {
    const wrapper = document.createElement('div')
    wrapper.className = 'set-wrapper'

    const button = document.createElement('button')
    button.className = 'set-button'
    button.innerHTML = `<span>${set.name}</span>`
    button.dataset.setId = set.id
    button.onclick = () => loadSet(set.id, button)

    wrapper.appendChild(button)
    container.appendChild(wrapper)
  })
}

// Load vocabulary set
function loadSet(setId, button) {
  if (activeButton) {
    activeButton.classList.remove('active')
  }

  const existingTables = document.querySelectorAll('.table-container')
  existingTables.forEach((table) => {
    table.remove()
  })

  currentSetId = setId
  activeButton = button
  button.classList.add('active')

  const template = document.getElementById('tableTemplate')
  const tableContainer = template.content.cloneNode(true).children[0]
  tableContainer.id = `tableContainer-${setId}`

  const setTitle = tableContainer.querySelector('.set-title')
  const tableBody = tableContainer.querySelector('tbody')
  const closeButton = tableContainer.querySelector('.close-button')
  const addButton = tableContainer.querySelector('.add-button')

  if (vocabularySets[setId]) {
    setTitle.textContent = vocabularySets[setId].name
    vocabularySets[setId].words.forEach((word) => {
      addNewRow(word.indo, word.eng, tableBody)
    })
  } else {
    setTitle.textContent = `Set ${setId}`
  }

  closeButton.onclick = () => closeTable(tableContainer, button)
  addButton.onclick = () => addNewRow('', '', tableBody)

  const setsContainer = document.getElementById('setsContainer')
  const buttonRows = Math.ceil(
    setsContainer.children.length / Math.floor(setsContainer.offsetWidth / 280)
  )
  const lastRowIndex =
    (buttonRows - 1) * Math.floor(setsContainer.offsetWidth / 280)

  const insertAfterElement =
    setsContainer.children[lastRowIndex] || setsContainer.lastElementChild
  insertAfterElement.after(tableContainer)

  requestAnimationFrame(() => {
    tableContainer.classList.add('visible')
  })
}

// Add new row to vocabulary table
function addNewRow(indo = '', eng = '', targetTableBody) {
  const newRow = document.createElement('tr')
  newRow.classList.add('row-enter')

  newRow.innerHTML = `
    <td>
      <div class="input-wrapper">
        <input type="text" value="${indo}" placeholder="Masukkan kata dalam Bahasa Indonesia">
      </div>
    </td>
    <td>
      <div class="input-wrapper">
        <input type="text" value="${eng}" placeholder="Enter word in English">
      </div>
    </td>
    <td style="text-align: center;">
      <button class="remove-button" onclick="removeRow(this)" title="Hapus baris ini">×</button>
    </td>
  `

  targetTableBody.appendChild(newRow)

  const inputs = newRow.querySelectorAll('input')
  inputs.forEach((input) => {
    input.addEventListener('input', () => saveVocabularySet(targetTableBody))
  })
}

// Remove row from vocabulary table
function removeRow(button) {
  const row = button.closest('tr')
  const tableBody = row.closest('tbody')

  row.style.opacity = '0'
  row.style.transform = 'translateX(20px)'
  setTimeout(() => {
    row.remove()
    saveVocabularySet(tableBody)
  }, 300)
}

// Save vocabulary set changes
function saveVocabularySet(tableBody) {
  if (!currentSetId) return

  const rows = tableBody.getElementsByTagName('tr')
  const words = []

  for (let row of rows) {
    const inputs = row.getElementsByTagName('input')
    words.push({
      indo: inputs[0].value,
      eng: inputs[1].value,
    })
  }

  if (!vocabularySets[currentSetId]) {
    vocabularySets[currentSetId] = {
      name: `Set ${currentSetId}`,
      words: [],
    }
  }
  vocabularySets[currentSetId].words = words
}

// Close vocabulary table
function closeTable(tableContainer, button) {
  tableContainer.classList.remove('visible')
  button.classList.remove('active')

  setTimeout(() => {
    tableContainer.remove()
    activeButton = null
    currentSetId = null
  }, 300)
}

// Initialize everything when the page loads
window.onload = () => {
  initBurgerMenu()
  initSetButtons()
}
