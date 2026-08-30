import './styles.css'

const copyEmailButton = document.querySelector('#copy-email')
const copyLabel = copyEmailButton?.querySelector('[data-copy-label]')
const copyStatus = document.querySelector('#copy-status')

copyEmailButton?.addEventListener('click', async () => {
  const email = copyEmailButton.dataset.email
  if (!email) return

  try {
    await navigator.clipboard.writeText(email)
  } catch {
    const temporaryInput = document.createElement('textarea')
    temporaryInput.value = email
    temporaryInput.setAttribute('readonly', '')
    temporaryInput.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(temporaryInput)
    temporaryInput.select()
    document.execCommand('copy')
    temporaryInput.remove()
  }

  if (copyLabel) copyLabel.textContent = 'Email Copied'
  if (copyStatus) copyStatus.textContent = `${email} copied to your clipboard.`

  window.setTimeout(() => {
    if (copyLabel) copyLabel.textContent = 'Copy Email'
  }, 2500)
})

const imageLightbox = document.querySelector('#image-lightbox')
const lightboxImage = imageLightbox?.querySelector('.image-lightbox-image')
const lightboxCaption = imageLightbox?.querySelector('.image-lightbox-caption')
const lightboxCloseButton = imageLightbox?.querySelector('.image-lightbox-close')
let activeImageTrigger

document.querySelectorAll('[data-zoomable-image]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const image = trigger.querySelector('img')
    if (!imageLightbox || !lightboxImage || !image) return

    activeImageTrigger = trigger
    lightboxImage.src = image.currentSrc || image.src
    lightboxImage.alt = image.alt
    if (lightboxCaption) lightboxCaption.textContent = image.alt
    imageLightbox.showModal()
  })
})

lightboxCloseButton?.addEventListener('click', () => imageLightbox?.close())
imageLightbox?.addEventListener('click', (event) => {
  if (event.target === imageLightbox) imageLightbox.close()
})
imageLightbox?.addEventListener('close', () => {
  lightboxImage?.removeAttribute('src')
  if (lightboxImage) lightboxImage.alt = ''
  activeImageTrigger?.focus()
})
