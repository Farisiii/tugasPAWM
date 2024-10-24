const burger = document.getElementById('burger')
const sidebar = document.getElementById('sidebar')
const navbar = document.getElementById('navbar')
const closeSidebar = document.getElementById('close-sidebar')

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }
})

burger.addEventListener('click', (e) => {
  e.stopPropagation()
  sidebar.classList.toggle('open')
})

closeSidebar.addEventListener('click', () => {
  sidebar.classList.remove('open')
})

document.addEventListener('click', (event) => {
  if (
    !sidebar.contains(event.target) &&
    !burger.contains(event.target) &&
    sidebar.classList.contains('open')
  ) {
    sidebar.classList.remove('open')
  }
})

sidebar.addEventListener('click', (e) => {
  e.stopPropagation()
})

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open')
  }
})

const translations = [
  { id: 'Selamat pagi', en: 'Good morning' },
  { id: 'Terima kasih', en: 'Thank you' },
  { id: 'Apa kabar?', en: 'How are you?' },
  { id: 'Sampai jumpa', en: 'Goodbye' },
  { id: 'Saya suka makanan ini', en: 'I like this food' },
  { id: 'Berapa harganya?', en: 'How much is it?' },
  { id: 'Berapa harganya?', en: 'How much is it?' },
  { id: 'Berapa harganya?', en: 'How much is it?' },
  { id: 'Berapa harganya?', en: 'How much is it?' },
  { id: 'Berapa harganya?', en: 'How much is it?' },
  { id: 'Berapa harganya?', en: 'How much is it?' },
  { id: 'Berapa harganya?', en: 'How much is it?' },
  { id: 'Berapa harganya?', en: 'How much is it?' },
]

function populateWords() {
  const indonesianList = document.getElementById('indonesianWords')
  const englishList = document.getElementById('englishWords')

  translations.forEach((pair) => {
    const indoDiv = document.createElement('div')
    indoDiv.className = 'word-pair'
    indoDiv.textContent = pair.id
    indonesianList.appendChild(indoDiv)

    const engDiv = document.createElement('div')
    engDiv.className = 'word-pair'
    engDiv.textContent = pair.en
    englishList.appendChild(engDiv)
  })
}

function startGame() {
  window.location.href = '../choiceGame/choiceGame.html'
}

window.onload = populateWords

function equalizeHeights() {
  const wordPairs = document.querySelectorAll('.word-pair')
  const allH2 = document.querySelectorAll('h2')
  let maxHeight = 0
  let maxHeight2 = 0

  // Reset height to auto to recalculate natural heights
  wordPairs.forEach((pair) => {
    pair.style.height = 'auto'
  })

  allH2.forEach((pair) => {
    pair.style.height = 'auto'
  })

  // Cari tinggi maksimum
  wordPairs.forEach((pair) => {
    maxHeight = Math.max(maxHeight, pair.offsetHeight)
  })

  allH2.forEach((pair) => {
    maxHeight2 = Math.max(maxHeight2, pair.offsetHeight)
  })

  // Set semua pasangan ke tinggi maksimum
  allH2.forEach((pair) => {
    pair.style.height = `${maxHeight2}px`
  })

  wordPairs.forEach((pair) => {
    pair.style.height = `${maxHeight}px`
  })
}

// Panggil fungsi saat halaman selesai dimuat dan saat ukuran berubah
window.addEventListener('load', equalizeHeights)
window.addEventListener('resize', equalizeHeights)
