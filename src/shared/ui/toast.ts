type ToastType = 'success' | 'error' | 'loading'

export function toast(message: string, type: ToastType) {
  const existingMessage = document.querySelector('.message')
  if (existingMessage) existingMessage.remove()

  const messageDiv = document.createElement('div')
  messageDiv.className = `message ${type}`
  messageDiv.textContent = message

  document.body.appendChild(messageDiv)

  if (type !== 'loading') {
    setTimeout(() => messageDiv.remove(), 3000)
  }
}