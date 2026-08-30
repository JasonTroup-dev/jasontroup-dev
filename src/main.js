import './styles.css'

const header = document.querySelector('[data-header]')
const menuToggle = document.querySelector('[data-menu-toggle]')
const navigation = document.querySelector('[data-navigation]')

const closeMenu = () => {
  header?.removeAttribute('data-menu-open')
  menuToggle?.setAttribute('aria-expanded', 'false')
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true'
  menuToggle.setAttribute('aria-expanded', String(!isOpen))
  header?.toggleAttribute('data-menu-open', !isOpen)
})

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu))
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu()
})
document.addEventListener('click', (event) => {
  if (!header?.hasAttribute('data-menu-open') || header.contains(event.target)) return
  closeMenu()
})

const updateScrollProgress = () => {
  const availableScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = availableScroll > 0 ? window.scrollY / availableScroll : 0
  document.documentElement.style.setProperty('--scroll-progress', String(progress))
  header?.toggleAttribute('data-scrolled', window.scrollY > 20)
}

updateScrollProgress()
window.addEventListener('scroll', updateScrollProgress, { passive: true })
window.addEventListener('resize', () => {
  updateScrollProgress()
  if (window.innerWidth > 720) closeMenu()
})

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const revealElements = document.querySelectorAll('.reveal')

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'))
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )
  revealElements.forEach((element) => revealObserver.observe(element))
}

const sections = [...document.querySelectorAll('main section[id]')]
const navLinks = [...(navigation?.querySelectorAll('a[href^="#"]') ?? [])]

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!visibleSection) return
      navLinks.forEach((link) => {
        link.toggleAttribute('aria-current', link.getAttribute('href') === `#${visibleSection.target.id}`)
      })
    },
    { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.25, 0.6] },
  )
  sections.forEach((section) => sectionObserver.observe(section))
}

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
  if (copyLabel) copyLabel.textContent = 'Email copied'
  if (copyStatus) copyStatus.textContent = `${email} copied to your clipboard.`
  window.setTimeout(() => {
    if (copyLabel) copyLabel.textContent = 'Copy email'
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
