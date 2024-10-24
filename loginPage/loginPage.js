function switchTab(tab) {
  // Remove active class from all elements
  document.querySelectorAll('.tab-button').forEach((button) => {
    button.classList.remove('active')
  })
  document.querySelectorAll('.auth-form').forEach((form) => {
    form.classList.remove('active')
  })

  // Add active class to selected tab
  if (tab === 'login') {
    document.querySelector('#loginForm').classList.add('active')
    document.querySelectorAll('.tab-button')[0].classList.add('active')
  } else {
    document.querySelector('#signupForm').classList.add('active')
    document.querySelectorAll('.tab-button')[1].classList.add('active')
  }

  // Clear all errors when switching tabs
  clearErrors()
}

function clearErrors() {
  document.querySelectorAll('.form-group').forEach((group) => {
    group.classList.remove('error')
  })
}

function showError(elementId, message) {
  const group = document.getElementById(elementId)
  group.classList.add('error')
  group.querySelector('.error-message').textContent = message
}

function handleLogin(event) {
  event.preventDefault()
  clearErrors()

  const email = document.getElementById('loginEmail').value
  const password = document.getElementById('loginPassword').value

  // Contoh validasi sederhana
  if (email !== 'test@email.com') {
    showError('loginEmailGroup', 'Email tidak terdaftar')
    return
  }
  if (password !== 'password123') {
    showError('loginPasswordGroup', 'Password salah')
    return
  }

  // Jika berhasil login
  window.location.href = '../homePage/homePage.html'
}

function handleSignup(event) {
  event.preventDefault()
  clearErrors()

  const email = document.getElementById('signupEmail').value
  const password = document.getElementById('signupPassword').value
  const confirmPassword = document.getElementById('confirmPassword').value

  // Contoh validasi
  if (email === 'test@email.com') {
    showError('signupEmailGroup', 'Email sudah terdaftar')
    return
  }
  if (password.length < 8) {
    showError('signupPasswordGroup', 'Password minimal 8 karakter')
    return
  }
  if (password !== confirmPassword) {
    showError('confirmPasswordGroup', 'Password tidak cocok')
    return
  }

  // Jika berhasil signup
  alert('Pendaftaran berhasil!')
}
