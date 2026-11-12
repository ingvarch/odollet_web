<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const APP_STORE_URL = 'https://apps.apple.com/app/id6751579293'

const COPYRIGHT_START_YEAR = 2025
const copyrightYears = computed(() => {
  const now = new Date().getFullYear()
  return now > COPYRIGHT_START_YEAR ? `${COPYRIGHT_START_YEAR}–${now}` : `${COPYRIGHT_START_YEAR}`
})

/* --- Mobile Menu State --- */
const mobileMenuOpen = ref(false)
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
function closeMobileMenu() {
  mobileMenuOpen.value = false
}

/* --- Hero Interactive Screen & Tachometer Pointer --- */
interface HeroMode {
  id: string
  code: string
  label: string
  metric: string
  sub: string
  image: string
  alt: string
  rpmPercent: number
}

const heroModes: HeroMode[] = [
  {
    id: 'garage',
    code: 'MODE 01 // GARAGE',
    label: 'Honda Shadow 750 (2007)',
    metric: '489 km',
    sub: '16.793 kr. logged this month',
    image: '/images/odollet_1.4.0_1.jpeg',
    alt: 'Odollet My Garage screen showing Honda Shadow 750, monthly mileage and expense bar charts, and Ride button',
    rpmPercent: 0.62
  },
  {
    id: 'gps',
    code: 'MODE 02 // GPS TELEMETRY',
    label: 'Reykjavík → Þingvellir Loop',
    metric: '117 km/h',
    sub: '96.4 km · 1:18:28 duration',
    image: '/images/odollet_1.4.0_3.jpeg',
    alt: 'Odollet Ride Details screen with GPS route map around Reykjavik and Thingvellir with speed and distance stats',
    rpmPercent: 0.86
  },
  {
    id: 'reports',
    code: 'MODE 03 // FUEL & REPORTS',
    label: 'Avg. Fuel Economy',
    metric: '6.2 L/100km',
    sub: '722 km total · 117.426 kr.',
    image: '/images/odollet_1.4.0_2.jpeg',
    alt: 'Odollet Reports screen with total mileage, expenses, average fuel consumption and category breakdown',
    rpmPercent: 0.74
  }
]

const activeHeroIndex = ref(0)
const isHeroSwitching = ref(false)
const activeHeroMode = computed(() => heroModes[activeHeroIndex.value] ?? heroModes[0]!)

function selectHeroMode(index: number) {
  if (index === activeHeroIndex.value) return
  isHeroSwitching.value = true
  activeHeroIndex.value = index
  setTimeout(() => {
    isHeroSwitching.value = false
  }, 220)
}

/* --- Odometer Mechanical Drum Counter --- */
const odoReady = ref(false)
const odoDigits = ['0', '4', '5', '4', '2', '2']
const odoTenths = ref(8)
let odoInterval: ReturnType<typeof setInterval> | null = null

/* --- Interactive GPS Telemetry Scrubbing (Reykjavík -> Þingvellir -> Selfoss Loop) --- */
const routeProgress = ref(0.78)
const isRoutePlaying = ref(false)
let routeRaf: number | null = null
let lastFrameTime = 0

interface RouteWaypoint {
  name: string
  at: number
  x: number
  y: number
  speed: number
  elevation: number
}

const waypoints: RouteWaypoint[] = [
  { name: 'Reykjavík', at: 0.0, x: 92, y: 192, speed: 48, elevation: 14 },
  { name: 'Mosfellsheiði', at: 0.24, x: 256, y: 122, speed: 94, elevation: 182 },
  { name: 'Þingvellir National Park', at: 0.45, x: 432, y: 78, speed: 82, elevation: 112 },
  { name: 'Ljósafoss / Grímsnes', at: 0.66, x: 454, y: 208, speed: 117, elevation: 74 },
  { name: 'Selfoss', at: 0.80, x: 472, y: 306, speed: 68, elevation: 18 },
  { name: 'Hveragerði', at: 0.90, x: 374, y: 266, speed: 88, elevation: 42 },
  { name: 'Kópavogur / Finish', at: 1.0, x: 116, y: 214, speed: 54, elevation: 18 }
]

// Exact closed loop path matching the Reykjavik -> Thingvellir -> Selfoss -> Hveragerdi route in odollet_1.4.0_3.jpeg
const svgRoutePath =
  'M 92 192 C 138 178, 198 140, 256 122 C 318 102, 378 86, 432 78 C 448 112, 438 164, 454 208 C 466 244, 476 280, 472 306 C 436 310, 404 282, 374 266 C 296 256, 206 220, 116 214'

const telemetryStats = computed(() => {
  const p = routeProgress.value
  const totalDist = (96.4 * p).toFixed(1)
  const totalSeconds = Math.round((1 * 3600 + 18 * 60 + 28) * p)
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  const duration = `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  const movingSeconds = Math.round((1 * 3600 + 16 * 60 + 35) * p)
  const mHrs = Math.floor(movingSeconds / 3600)
  const mMins = Math.floor((movingSeconds % 3600) / 60)
  const mSecs = movingSeconds % 60
  const movingTime = `${mHrs}:${String(mMins).padStart(2, '0')}:${String(mSecs).padStart(2, '0')}`

  // Interpolate current waypoint & speed
  let currentWp = waypoints[0]!
  let nextWp = waypoints[waypoints.length - 1]!
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i]!
    const b = waypoints[i + 1]!
    if (p >= a.at && p <= b.at) {
      currentWp = a
      nextWp = b
      break
    }
  }
  const span = Math.max(0.001, nextWp.at - currentWp.at)
  const localT = Math.min(1, Math.max(0, (p - currentWp.at) / span))
  const currentSpeed = Math.round(currentWp.speed + (nextWp.speed - currentWp.speed) * localT)
  const riderX = currentWp.x + (nextWp.x - currentWp.x) * localT
  const riderY = currentWp.y + (nextWp.y - currentWp.y) * localT
  const maxSpeed = p >= 0.62 ? 117 : Math.max(76, currentSpeed)

  return {
    distance: totalDist,
    duration,
    movingTime,
    avgSpeed: 76,
    currentSpeed,
    maxSpeed,
    elevationGain: 4,
    locationName: localT > 0.5 ? nextWp.name : currentWp.name,
    riderX,
    riderY
  }
})

function stepRouteLoop(timestamp: number) {
  if (!isRoutePlaying.value) return
  if (!lastFrameTime) lastFrameTime = timestamp
  const dt = (timestamp - lastFrameTime) / 1000
  lastFrameTime = timestamp

  routeProgress.value += dt * 0.11
  if (routeProgress.value >= 1) {
    routeProgress.value = 0.02
  }
  routeRaf = requestAnimationFrame(stepRouteLoop)
}

function toggleRoutePlay() {
  isRoutePlaying.value = !isRoutePlaying.value
  if (isRoutePlaying.value) {
    lastFrameTime = 0
    routeRaf = requestAnimationFrame(stepRouteLoop)
  } else if (routeRaf !== null) {
    cancelAnimationFrame(routeRaf)
    routeRaf = null
  }
}

function onScrubRoute(event: Event) {
  const target = event.target as HTMLInputElement
  routeProgress.value = parseFloat(target.value)
  if (isRoutePlaying.value) {
    isRoutePlaying.value = false
    if (routeRaf !== null) {
      cancelAnimationFrame(routeRaf)
      routeRaf = null
    }
  }
}

/* --- Tagline Word-by-Word Scroll Reveal --- */
const statementEl = ref<HTMLElement | null>(null)
const statementProgress = ref(0)

interface StatementWord {
  text: string
  accent?: boolean
}

const statementWords: StatementWord[] = [
  { text: 'Built' },
  { text: 'for' },
  { text: 'riders' },
  { text: 'who' },
  { text: 'measure' },
  { text: 'seasons' },
  { text: 'in' },
  { text: 'kilometers,', accent: true },
  { text: 'keep' },
  { text: 'every' },
  { text: 'valve' },
  { text: 'check' },
  { text: 'and' },
  { text: 'oil' },
  { text: 'change' },
  { text: 'on' },
  { text: 'schedule,', accent: true },
  { text: 'and' },
  { text: 'keep' },
  { text: 'their' },
  { text: 'full' },
  { text: 'ride' },
  { text: 'history' },
  { text: 'on' },
  { text: 'their' },
  { text: 'own' },
  { text: 'iPhone', accent: true },
  { text: 'never' },
  { text: 'on' },
  { text: 'someone' },
  { text: 'else’s' },
  { text: 'server.' }
]

let scrollTicking = false
function updateScrollLinkedMoments() {
  scrollTicking = false
  if (!statementEl.value) return
  const rect = statementEl.value.getBoundingClientRect()
  const vh = window.innerHeight || 800
  // Start revealing when top enters 82% of viewport, finish when top reaches 22%
  const start = vh * 0.85
  const end = vh * 0.2
  const raw = (start - rect.top) / (start - end)
  statementProgress.value = Math.min(1, Math.max(0, raw))
}

function onWindowScroll() {
  if (!scrollTicking) {
    scrollTicking = true
    requestAnimationFrame(updateScrollLinkedMoments)
  }
}

/* --- 4-Screen Interactive Cockpit Showcase --- */
interface CockpitScreen {
  id: string
  indexLabel: string
  title: string
  headline: string
  caption: string
  src: string
  alt: string
  badge?: string
  specs: { label: string; value: string }[]
}

const cockpitScreens: CockpitScreen[] = [
  {
    id: 'garage',
    indexLabel: '01 // MY GARAGE',
    title: 'My Garage',
    headline: 'Active bike, monthly charts, and one-tap Ride start.',
    caption: 'See your motorcycle hero photo, this month’s mileage and expense bars day-by-day, and launch a GPS Ride or quick log record with a single thumb tap.',
    src: '/images/odollet_1.4.0_1.jpeg',
    alt: 'Odollet home screen with My Garage, mileage and expense charts, and a Ride button',
    specs: [
      { label: 'MONTHLY MILEAGE', value: '489 km' },
      { label: 'MONTHLY SPEND', value: '16.793 kr.' },
      { label: 'PRIMARY ACTION', value: '1-Tap GPS Ride!' }
    ]
  },
  {
    id: 'rides',
    indexLabel: '02 // GPS RIDES',
    title: 'GPS Rides',
    headline: 'Full route geometry, speed telemetry, and recap videos.',
    caption: 'Track each ride on the map with distance, total duration, moving time, average and max speed, and elevation gain. Share ride posters or export an on-device recap video to Photos.',
    src: '/images/odollet_1.4.0_3.jpeg',
    alt: 'Ride details screen with a map of the route around Reykjavik and ride statistics',
    badge: 'New in 1.4.0',
    specs: [
      { label: 'ROUTE DISTANCE', value: '96,4 km' },
      { label: 'MAX / AVG SPEED', value: '117 / 76 km/h' },
      { label: 'MOVING TIME', value: '1:16:35' }
    ]
  },
  {
    id: 'reports',
    indexLabel: '03 // REPORTS & FUEL',
    title: 'Reports',
    headline: 'W / M / 3M / Y / A breakdowns for mileage, spend, and L/100 km.',
    caption: 'Spot when fuel consumption drifts and see exactly where your money goes across Oil Change, Inspection, Insurance, and Refuel categories.',
    src: '/images/odollet_1.4.0_2.jpeg',
    alt: 'Reports screen with total mileage, expenses, average fuel consumption and expense breakdown chart',
    specs: [
      { label: 'TOTAL MILEAGE', value: '722 km' },
      { label: 'AVG CONSUMPTION', value: '6.2 L/100 km' },
      { label: 'TIME FILTERS', value: 'W · M · 3M · Y · A' }
    ]
  },
  {
    id: 'profile',
    indexLabel: '04 // BIKE PROFILE & PDF',
    title: 'Bike Profile',
    headline: 'Complete identity sheet and crisp vector Service History PDF.',
    caption: 'Keep make, model, year, current odometer, license plate, VIN, and ownership duration in one place — with instant export to a buyer-ready Service History PDF.',
    src: '/images/odollet_1.4.0_4.jpeg',
    alt: 'Honda Shadow 750 motorcycle profile with VIN, license plate, ownership and service history link',
    specs: [
      { label: 'ODOMETER', value: '45,422 km' },
      { label: 'OWNERSHIP', value: '4y 11mo' },
      { label: 'EXPORT FORMAT', value: 'Vector PDF' }
    ]
  }
]

const activeCockpitIndex = ref(0)
const isCockpitSwitching = ref(false)
const activeCockpit = computed(() => cockpitScreens[activeCockpitIndex.value] ?? cockpitScreens[0]!)

function selectCockpitScreen(index: number) {
  if (index === activeCockpitIndex.value) return
  isCockpitSwitching.value = true
  activeCockpitIndex.value = index
  setTimeout(() => {
    isCockpitSwitching.value = false
  }, 220)
}

/* --- Bento Interactive Micro-Stories --- */
// 1. Multi-Bike Garage Interactive Switcher
interface GarageBike {
  name: string
  year: number
  odo: string
  vin: string
  plate: string
  owned: string
  lastEvent: string
}

const garageBikes: GarageBike[] = [
  {
    name: 'Honda Shadow 750',
    year: 2007,
    odo: '45,422 km',
    vin: 'JH2RC500*7M******',
    plate: '11111',
    owned: '4y 11mo',
    lastEvent: 'Ride · 96.4 km (Þingvellir Loop)'
  },
  {
    name: 'BMW R 1250 GS',
    year: 2022,
    odo: '18,940 km',
    vin: 'WB10J910*N6******',
    plate: 'GS-842',
    owned: '2y 04mo',
    lastEvent: 'Refuel · 16.4 L (5.1 L/100 km)'
  },
  {
    name: 'Triumph Speed Twin',
    year: 2024,
    odo: '6,110 km',
    vin: 'SMTD44H8*RT******',
    plate: 'TR-900',
    owned: '1y 02mo',
    lastEvent: 'Oil & Filter Service · 6,000 km'
  }
]
const selectedBikeIdx = ref(0)
const activeGarageBike = computed(() => garageBikes[selectedBikeIdx.value] ?? garageBikes[0]!)

// 2. Interactive Reports Period Switcher (W / M / 3M / Y / A)
interface ReportPeriodData {
  key: string
  mileage: string
  expenses: string
  fuel: string
  bars: { label: string; color: string; pct: number; amount: string }[]
}

const reportPeriods: ReportPeriodData[] = [
  {
    key: 'W',
    mileage: '184 km',
    expenses: '4.850 kr.',
    fuel: '5.9 L/100 km',
    bars: [
      { label: 'Refuel', color: '#F43F5E', pct: 82, amount: '4.850 kr.' },
      { label: 'Oil Change', color: '#FF6B00', pct: 0, amount: '0 kr.' },
      { label: 'Inspection', color: '#22C55E', pct: 0, amount: '0 kr.' },
      { label: 'Insurance', color: '#06B6D4', pct: 0, amount: '0 kr.' }
    ]
  },
  {
    key: 'M',
    mileage: '489 km',
    expenses: '16.793 kr.',
    fuel: '6.1 L/100 km',
    bars: [
      { label: 'Oil Change', color: '#FF6B00', pct: 64, amount: '9.400 kr.' },
      { label: 'Refuel', color: '#F43F5E', pct: 48, amount: '7.393 kr.' },
      { label: 'Inspection', color: '#22C55E', pct: 0, amount: '0 kr.' },
      { label: 'Insurance', color: '#06B6D4', pct: 0, amount: '0 kr.' }
    ]
  },
  {
    key: '3M',
    mileage: '610 km',
    expenses: '54.210 kr.',
    fuel: '6.2 L/100 km',
    bars: [
      { label: 'Oil Change', color: '#FF6B00', pct: 78, amount: '28.500 kr.' },
      { label: 'Insurance', color: '#06B6D4', pct: 46, amount: '16.200 kr.' },
      { label: 'Refuel', color: '#F43F5E', pct: 28, amount: '9.510 kr.' },
      { label: 'Inspection', color: '#22C55E', pct: 0, amount: '0 kr.' }
    ]
  },
  {
    key: 'Y',
    mileage: '722 km',
    expenses: '117.426 kr.',
    fuel: '6.2 L/100 km',
    bars: [
      { label: 'Oil Change', color: '#FF6B00', pct: 90, amount: '51.200 kr.' },
      { label: 'Inspection', color: '#22C55E', pct: 52, amount: '29.400 kr.' },
      { label: 'Insurance', color: '#06B6D4', pct: 42, amount: '24.800 kr.' },
      { label: 'Refuel', color: '#F43F5E', pct: 18, amount: '12.026 kr.' }
    ]
  },
  {
    key: 'A',
    mileage: '722 km',
    expenses: '117.426 kr.',
    fuel: '6.2 L/100 km',
    bars: [
      { label: 'Oil Change', color: '#FF6B00', pct: 92, amount: '51.200 kr.' },
      { label: 'Inspection', color: '#22C55E', pct: 50, amount: '29.400 kr.' },
      { label: 'Insurance', color: '#06B6D4', pct: 41, amount: '24.800 kr.' },
      { label: 'Refuel', color: '#F43F5E', pct: 16, amount: '12.026 kr.' }
    ]
  }
]
const selectedPeriodIdx = ref(4) // 'A' default matching screenshot 2
const activeReportPeriod = computed(() => reportPeriods[selectedPeriodIdx.value] ?? reportPeriods[4]!)

// 3. Interactive Service Interval Reset Demo
const serviceDone = ref(false)
function toggleServiceReset() {
  serviceDone.value = !serviceDone.value
}

/* --- IntersectionObserver for Section Reveals --- */
let revealObserver: IntersectionObserver | null = null

onMounted(() => {
  setTimeout(() => {
    odoReady.value = true
  }, 120)

  odoInterval = setInterval(() => {
    odoTenths.value = (odoTenths.value + 1) % 10
  }, 3500)

  window.addEventListener('scroll', onWindowScroll, { passive: true })
  updateScrollLinkedMoments()

  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          revealObserver?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
  )

  document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    revealObserver?.observe(el)
  })
})

onUnmounted(() => {
  if (odoInterval) clearInterval(odoInterval)
  if (routeRaf !== null) cancelAnimationFrame(routeRaf)
  window.removeEventListener('scroll', onWindowScroll)
  revealObserver?.disconnect()
})
</script>

<template>
  <div class="cockpit-page">
    <!-- Floating Instrument Cluster Navigation -->
    <header class="nav-shell">
      <nav class="nav-island" aria-label="Primary">
        <RouterLink to="/" class="nav-brand" aria-label="Odollet home" @click="closeMobileMenu">
          <img src="/images/AppIcon.jpg" alt="" class="brand-icon" aria-hidden="true" />
          <span class="brand-logo">Odollet</span>
          <span class="brand-odo tabular" aria-hidden="true">45,422.{{ odoTenths }} KM</span>
        </RouterLink>

        <div class="nav-links-desktop">
          <a href="#telemetry" class="nav-link">GPS Telemetry</a>
          <a href="#cockpit" class="nav-link">Cockpit</a>
          <a href="#logbook" class="nav-link">Logbook</a>
          <a href="#architecture" class="nav-link">Zero-Tracking</a>
          <RouterLink to="/privacy-policy" class="nav-link">Privacy</RouterLink>
        </div>

        <div class="nav-actions">
          <a :href="APP_STORE_URL" class="btn-island-sm" target="_blank" rel="noopener">
            <span>App Store</span>
            <span class="btn-island-icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75">
                <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </a>

          <button
            type="button"
            class="nav-burger"
            :class="{ 'is-open': mobileMenuOpen }"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle navigation menu"
            @click="toggleMobileMenu"
          >
            <span class="burger-line"></span>
            <span class="burger-line"></span>
          </button>
        </div>
      </nav>

      <!-- Mobile Full-Height Glass Overlay -->
      <div class="mobile-drawer" :class="{ 'is-open': mobileMenuOpen }">
        <div class="mobile-drawer-links">
          <a href="#telemetry" class="mobile-link" style="--i: 1" @click="closeMobileMenu">GPS Telemetry</a>
          <a href="#cockpit" class="mobile-link" style="--i: 2" @click="closeMobileMenu">Cockpit Screens</a>
          <a href="#logbook" class="mobile-link" style="--i: 3" @click="closeMobileMenu">Garage &amp; Logbook</a>
          <a href="#architecture" class="mobile-link" style="--i: 4" @click="closeMobileMenu">Zero-Tracking Spec</a>
          <RouterLink to="/privacy-policy" class="mobile-link" style="--i: 5" @click="closeMobileMenu">Privacy Policy</RouterLink>
          <a :href="APP_STORE_URL" class="btn-redline mobile-cta" style="--i: 6" target="_blank" rel="noopener" @click="closeMobileMenu">
            <span>Download for iPhone</span>
            <span class="btn-circle-icon" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </header>

    <main id="main-content">
      <!-- SECTION 1: HERO INSTRUMENT CLUSTER -->
      <section class="hero-section">
        <div class="hero-ambient" aria-hidden="true"></div>
        <div class="container hero-grid">
          <!-- Left Column: Odometer Drum + Headline + CTAs -->
          <div class="hero-copy-col">
            <!-- Mechanical Odometer Drum Readout -->
            <div class="odo-cluster" :class="{ 'is-ready': odoReady }">
              <div class="odo-drum-group" aria-label="Odometer 45,422.8 kilometers">
                <span class="odo-label">ODO</span>
                <div class="odo-drums tabular" aria-hidden="true">
                  <span
                    v-for="(digit, idx) in odoDigits"
                    :key="idx"
                    class="odo-drum"
                    :style="{ '--delay': `${idx * 55}ms` }"
                  >
                    <span class="odo-drum-value">{{ digit }}</span>
                  </span>
                  <span class="odo-drum odo-drum-tenth">
                    <span class="odo-drum-value">.{{ odoTenths }}</span>
                  </span>
                </div>
                <span class="odo-unit">KM</span>
              </div>
              <span class="odo-divider" aria-hidden="true"></span>
              <span class="odo-release">
                <span class="odo-live-dot"></span>
                1.4.0 GPS RIDES
              </span>
            </div>

            <h1 class="hero-title">
              The odometer wallet that rides with you.
            </h1>

            <p class="hero-subtitle">
              A focused iPhone logbook built for motorcyclists. Record GPS rides on the map, track mileage, fuel consumption, expenses, and maintenance intervals, and export crisp PDF service records without creating an account.
            </p>

            <div class="hero-cta-row">
              <a :href="APP_STORE_URL" class="btn-redline" target="_blank" rel="noopener">
                <span>Download on the App Store</span>
                <span class="btn-circle-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </a>
              <a href="#telemetry" class="btn-cockpit-secondary">
                <span>Inspect GPS telemetry</span>
              </a>
            </div>

            <!-- Hardware Telemetry Spec Strip -->
            <dl class="hero-spec-strip tabular">
              <div class="spec-cell">
                <dt>PLATFORM</dt>
                <dd>iOS 17+ Native</dd>
              </div>
              <div class="spec-cell">
                <dt>CLOUD SYNC</dt>
                <dd>Opt-in CloudKit</dd>
              </div>
              <div class="spec-cell">
                <dt>PRIVACY</dt>
                <dd>0 Servers · 0 Ads</dd>
              </div>
              <div class="spec-cell">
                <dt>PRICE</dt>
                <dd>Free on App Store</dd>
              </div>
            </dl>
          </div>

          <!-- Right Column: Tachometer Dial + Double-Bezel iPhone Stage + Interactive HUD Chips -->
          <div class="hero-stage-col">
            <div class="tachometer-stage">
              <!-- Vector Tachometer Ring (Inspired by Odollet AppIcon) -->
              <svg class="tacho-svg" viewBox="0 0 520 520" aria-hidden="true">
                <defs>
                  <linearGradient id="tachoRedlineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FF852B" />
                    <stop offset="100%" stop-color="#FF6B00" />
                  </linearGradient>
                </defs>
                <!-- Outer Anodized Ring -->
                <circle cx="260" cy="260" r="240" fill="none" stroke="rgba(226, 234, 248, 0.06)" stroke-width="1" />
                <!-- Navy Dial Track -->
                <circle
                  cx="260"
                  cy="260"
                  r="212"
                  fill="none"
                  stroke="#0C214A"
                  stroke-width="26"
                  stroke-dasharray="980 360"
                  stroke-dashoffset="-180"
                  stroke-linecap="round"
                  opacity="0.7"
                />
                <!-- Redline Orange Quadrant (Top-Right, matching AppIcon.jpg) -->
                <circle
                  cx="260"
                  cy="260"
                  r="212"
                  fill="none"
                  stroke="url(#tachoRedlineGrad)"
                  stroke-width="26"
                  :stroke-dasharray="`${Math.round(330 * activeHeroMode.rpmPercent)} 1340`"
                  stroke-dashoffset="332"
                  stroke-linecap="butt"
                  class="tacho-redline-arc"
                />
                <!-- Dashed Road / Scale Marks -->
                <circle
                  cx="260"
                  cy="260"
                  r="212"
                  fill="none"
                  stroke="rgba(243, 246, 250, 0.45)"
                  stroke-width="3"
                  stroke-dasharray="16 38"
                  stroke-linecap="round"
                />
              </svg>

              <!-- Machined Double-Bezel iPhone 16 Pro Chassis -->
              <div class="iphone-double-bezel">
                <div class="iphone-inner-core">
                  <img
                    :src="activeHeroMode.image"
                    :alt="activeHeroMode.alt"
                    class="iphone-screen-img"
                    :class="{ 'is-transitioning': isHeroSwitching }"
                  />
                </div>
              </div>

              <!-- Interactive Telemetry Mode Selector Chips around the Phone -->
              <div class="hero-hud-selectors" role="tablist" aria-label="Switch active iPhone screen">
                <button
                  v-for="(mode, index) in heroModes"
                  :key="mode.id"
                  type="button"
                  role="tab"
                  :aria-selected="activeHeroIndex === index"
                  class="hud-chip"
                  :class="[`hud-chip-${index}`, { 'is-active': activeHeroIndex === index }]"
                  @click="selectHeroMode(index)"
                >
                  <span class="hud-chip-code tabular">{{ mode.code }}</span>
                  <span class="hud-chip-metric tabular">{{ mode.metric }}</span>
                  <span class="hud-chip-sub">{{ mode.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 2: INTERACTIVE GPS RIDE TELEMETRY CONSOLE -->
      <section id="telemetry" class="telemetry-section reveal-on-scroll">
        <div class="container">
          <div class="section-header-split">
            <div>
              <h2 class="section-heading">
                Tap “Ride!” and record every kilometer on the map.
              </h2>
            </div>
            <p class="section-lead">
              Odollet captures your GPS route geometry, distance, total and moving duration, average and peak speed, and elevation gain entirely on your iPhone — with a real-time Lock Screen Live Activity while you ride.
            </p>
          </div>

          <div class="double-bezel telemetry-console-outer">
            <div class="double-bezel-core telemetry-console">
              <!-- Left: Interactive Topographic Route Map (Reykjavík -> Þingvellir -> Selfoss) -->
              <div class="telemetry-map-stage">
                <div class="map-top-bar tabular">
                  <div class="map-coord-group">
                    <span class="status-led"></span>
                    <span>TRACK // IS-01 GOLDEN CIRCLE LOOP</span>
                  </div>
                  <div class="map-coord-right">
                    <span>64.1466° N, 21.9426° W</span>
                  </div>
                </div>

                <div class="map-canvas-wrap">
                  <svg class="route-svg" viewBox="0 0 560 360" role="img" aria-label="Interactive GPS route map from Reykjavík to Þingvellir National Park, Selfoss, and Hveragerði">
                    <defs>
                      <linearGradient id="routeActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#1E88FF" />
                        <stop offset="68%" stop-color="#1E88FF" />
                        <stop offset="100%" stop-color="#FF6B00" />
                      </linearGradient>
                      <radialGradient id="riderPulse" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="rgba(255, 107, 0, 0.55)" />
                        <stop offset="100%" stop-color="rgba(255, 107, 0, 0)" />
                      </radialGradient>
                    </defs>

                    <!-- Topographic Contour Lines & Water Bodies (Faxaflói & Þingvallavatn) -->
                    <path
                      d="M 0 90 Q 85 95, 105 140 Q 60 165, 92 192 Q 55 220, 48 265 L 0 275 Z"
                      fill="rgba(30, 136, 255, 0.09)"
                      stroke="rgba(30, 136, 255, 0.22)"
                      stroke-width="1"
                    />
                    <!-- Þingvallavatn Lake -->
                    <path
                      d="M 380 95 C 405 90, 428 112, 424 148 C 420 176, 392 184, 376 162 C 364 142, 366 104, 380 95 Z"
                      fill="rgba(30, 136, 255, 0.13)"
                      stroke="rgba(30, 136, 255, 0.28)"
                      stroke-width="1"
                    />

                    <!-- Subtle Elevation Contours -->
                    <path d="M 160 40 Q 280 85, 340 40" fill="none" stroke="rgba(226, 234, 248, 0.05)" stroke-width="1" stroke-dasharray="4 4" />
                    <path d="M 140 310 Q 260 260, 390 340" fill="none" stroke="rgba(226, 234, 248, 0.05)" stroke-width="1" stroke-dasharray="4 4" />
                    <path d="M 220 180 C 280 150, 330 190, 360 220" fill="none" stroke="rgba(226, 234, 248, 0.05)" stroke-width="1" />

                    <!-- Base Full Route Track (Dimmed) -->
                    <path
                      :d="svgRoutePath"
                      fill="none"
                      stroke="rgba(226, 234, 248, 0.14)"
                      stroke-width="5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />

                    <!-- Active Scrubbed GPS Route Track -->
                    <path
                      :d="svgRoutePath"
                      fill="none"
                      stroke="url(#routeActiveGrad)"
                      stroke-width="5.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      pathLength="100"
                      :stroke-dasharray="`${routeProgress * 100} 100`"
                    />

                    <!-- Waypoint Nodes & Labels -->
                    <g v-for="wp in waypoints" :key="wp.name">
                      <circle
                        :cx="wp.x"
                        :cy="wp.y"
                        r="4"
                        :fill="routeProgress >= wp.at ? '#F3F6FA' : '#1E2638'"
                        :stroke="routeProgress >= wp.at ? '#1E88FF' : 'rgba(226,234,248,0.3)'"
                        stroke-width="2"
                      />
                    </g>

                    <text x="82" y="176" class="map-label map-label-major">Reykjavík</text>
                    <text x="348" y="62" class="map-label">Þingvellir National Park</text>
                    <text x="355" y="138" class="map-label map-label-water">Þingvallavatn</text>
                    <text x="484" y="312" class="map-label">Selfoss</text>
                    <text x="304" y="286" class="map-label">Hveragerði</text>

                    <!-- Live Rider Position Marker -->
                    <g :transform="`translate(${telemetryStats.riderX}, ${telemetryStats.riderY})`">
                      <circle cx="0" cy="0" r="20" fill="url(#riderPulse)" />
                      <circle cx="0" cy="0" r="6.5" fill="#FF6B00" stroke="#090B10" stroke-width="2" />
                    </g>
                  </svg>
                </div>

                <!-- Interactive Telemetry Scrubber Control Bar -->
                <div class="telemetry-scrubber-bar">
                  <button
                    type="button"
                    class="scrubber-play-btn"
                    :aria-label="isRoutePlaying ? 'Pause GPS route replay' : 'Play GPS route replay'"
                    @click="toggleRoutePlay"
                  >
                    <svg v-if="!isRoutePlaying" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                      <path d="M4 3.2l9.2 4.8L4 12.8V3.2z" />
                    </svg>
                    <svg v-else viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                      <path d="M3.5 3h3v10h-3V3zm6 0h3v10h-3V3z" />
                    </svg>
                    <span>{{ isRoutePlaying ? 'Pause' : 'Replay ride' }}</span>
                  </button>

                  <div class="scrubber-slider-wrap">
                    <label for="ride-scrubber" class="sr-only">Scrub ride timeline</label>
                    <input
                      id="ride-scrubber"
                      type="range"
                      min="0.02"
                      max="1"
                      step="0.01"
                      :value="routeProgress"
                      class="telemetry-range"
                      @input="onScrubRoute"
                    />
                  </div>

                  <span class="scrubber-waypoint tabular">{{ telemetryStats.locationName }}</span>
                </div>
              </div>

              <!-- Right: Live Telemetry Readouts + Lock Screen Live Activity -->
              <div class="telemetry-readout-col">
                <div class="telemetry-header-row">
                  <span class="telemetry-tag">RIDE TELEMETRY READOUT</span>
                  <span class="telemetry-pct tabular">{{ Math.round(routeProgress * 100) }}%</span>
                </div>

                <div class="telemetry-metrics-grid tabular">
                  <div class="telemetry-metric-box">
                    <span class="tm-label">DISTANCE</span>
                    <span class="tm-value">{{ telemetryStats.distance }} <small>km</small></span>
                  </div>
                  <div class="telemetry-metric-box">
                    <span class="tm-label">DURATION</span>
                    <span class="tm-value">{{ telemetryStats.duration }}</span>
                  </div>
                  <div class="telemetry-metric-box">
                    <span class="tm-label">MOVING TIME</span>
                    <span class="tm-value">{{ telemetryStats.movingTime }}</span>
                  </div>
                  <div class="telemetry-metric-box">
                    <span class="tm-label">INSTANT SPEED</span>
                    <span class="tm-value tm-accent">{{ telemetryStats.currentSpeed }} <small>km/h</small></span>
                  </div>
                  <div class="telemetry-metric-box">
                    <span class="tm-label">MAX SPEED</span>
                    <span class="tm-value">{{ telemetryStats.maxSpeed }} <small>km/h</small></span>
                  </div>
                  <div class="telemetry-metric-box">
                    <span class="tm-label">ELEVATION GAIN</span>
                    <span class="tm-value">{{ telemetryStats.elevationGain }} <small>m</small></span>
                  </div>
                </div>

                <!-- Lock Screen Live Activity Hardware Preview -->
                <div class="live-activity-pill">
                  <div class="la-top">
                    <div class="la-brand">
                      <img src="/images/AppIcon.jpg" alt="" class="la-icon" />
                      <span>ODOLLET LIVE ACTIVITY</span>
                    </div>
                    <span class="la-rec"><span class="la-dot"></span>REC</span>
                  </div>
                  <div class="la-stats tabular">
                    <div>
                      <span class="la-val">{{ telemetryStats.distance }} km</span>
                      <span class="la-lbl">Distance</span>
                    </div>
                    <div>
                      <span class="la-val">{{ telemetryStats.duration }}</span>
                      <span class="la-lbl">Elapsed</span>
                    </div>
                    <div>
                      <span class="la-val la-speed">{{ telemetryStats.currentSpeed }} km/h</span>
                      <span class="la-lbl">Current Speed</span>
                    </div>
                  </div>
                </div>

                <p class="telemetry-privacy-note">
                  Compressed GPS point tracks stay inside your iPhone’s encrypted sandbox. Zero location data is ever sent to external servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 3: TAGLINE WORD-BY-WORD SCROLL REVEAL -->
      <section ref="statementEl" class="statement-section">
        <div class="container">
          <p class="statement-copy">
            <span
              v-for="(word, idx) in statementWords"
              :key="idx"
              class="statement-word"
              :class="{
                'is-lit': statementProgress >= idx / statementWords.length,
                'is-accent': word.accent && statementProgress >= idx / statementWords.length
              }"
            >{{ word.text }}</span>
          </p>
        </div>
      </section>

      <!-- SECTION 4: 4-SCREEN INTERACTIVE COCKPIT SHOWCASE -->
      <section id="cockpit" class="cockpit-section reveal-on-scroll">
        <div class="container">
          <div class="section-header-split">
            <div>
              <h2 class="section-heading">
                Four native screens. Every record at thumb reach.
              </h2>
            </div>
            <p class="section-lead">
              Built with native iOS components for quick entries at the fuel pump, in the garage, or right after a ride. Select any view to inspect the live interface.
            </p>
          </div>

          <div class="cockpit-showcase-grid">
            <!-- Left: Interactive Mode Deck -->
            <div class="cockpit-deck" role="tablist" aria-label="Odollet app screens">
              <button
                v-for="(screen, idx) in cockpitScreens"
                :key="screen.id"
                type="button"
                role="tab"
                :aria-selected="activeCockpitIndex === idx"
                class="cockpit-card-btn"
                :class="{ 'is-active': activeCockpitIndex === idx }"
                @click="selectCockpitScreen(idx)"
              >
                <div class="cc-top-row">
                  <span class="cc-index tabular">{{ screen.indexLabel }}</span>
                  <span v-if="screen.badge" class="cc-badge">{{ screen.badge }}</span>
                </div>
                <h3 class="cc-title">{{ screen.headline }}</h3>
                <p class="cc-caption">{{ screen.caption }}</p>
                <div class="cc-specs tabular">
                  <div v-for="spec in screen.specs" :key="spec.label" class="cc-spec-item">
                    <span class="cc-spec-lbl">{{ spec.label }}</span>
                    <span class="cc-spec-val">{{ spec.value }}</span>
                  </div>
                </div>
              </button>
            </div>

            <!-- Right: Double-Bezel Stage with Active iOS Screen -->
            <div class="cockpit-stage-wrap">
              <div class="double-bezel cockpit-stage-bezel">
                <div class="double-bezel-core cockpit-stage-core">
                  <div class="stage-top-telemetry tabular">
                    <span>ACTIVE VIEW // {{ activeCockpit.title.toUpperCase() }}</span>
                    <span>iOS 17+</span>
                  </div>

                  <div class="stage-phone-frame">
                    <img
                      :src="activeCockpit.src"
                      :alt="activeCockpit.alt"
                      class="stage-phone-img"
                      :class="{ 'is-switching': isCockpitSwitching }"
                    />
                  </div>

                  <div class="stage-dots" aria-hidden="true">
                    <span
                      v-for="(screen, idx) in cockpitScreens"
                      :key="screen.id"
                      class="stage-dot"
                      :class="{ 'is-active': activeCockpitIndex === idx }"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 5: ENGINEERED BENTO GRID WITH LIVING UI MICRO-STORIES -->
      <section id="logbook" class="bento-section reveal-on-scroll">
        <div class="container">
          <div class="section-header-split">
            <div>
              <h2 class="section-heading">
                Engineered for the whole ownership lifecycle.
              </h2>
            </div>
            <p class="section-lead">
              From purchase day and routine oil intervals to fuel drift detection and resale service history PDFs. Interact with the modules below.
            </p>
          </div>

          <div class="bento-grid">
            <!-- BENTO 1 (Span 7): Multi-Bike Garage Interactive Switcher -->
            <article class="double-bezel bento-span-7">
              <div class="double-bezel-core bento-card">
                <div class="bento-head">
                  <div class="bento-icon-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                      <circle cx="5.5" cy="17.5" r="3.5" />
                      <circle cx="18.5" cy="17.5" r="3.5" />
                      <path d="M5.5 17.5L9.5 9h5l3 4.5M9.5 9L7 6H4M14.5 9l2-3h2.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="bento-title">Multi-Bike Garage</h3>
                    <p class="bento-desc">
                      Store every motorcycle you own with VIN, license plate, purchase date, and hero photo. Switch active bikes in one tap.
                    </p>
                  </div>
                </div>

                <!-- Interactive Garage Switcher UI -->
                <div class="garage-widget">
                  <div class="garage-tabs" role="tablist" aria-label="Select motorcycle from garage">
                    <button
                      v-for="(bike, idx) in garageBikes"
                      :key="bike.name"
                      type="button"
                      role="tab"
                      :aria-selected="selectedBikeIdx === idx"
                      class="garage-tab"
                      :class="{ 'is-active': selectedBikeIdx === idx }"
                      @click="selectedBikeIdx = idx"
                    >
                      <span>{{ bike.name }}</span>
                      <small class="tabular">'{{ String(bike.year).slice(-2) }}</small>
                    </button>
                  </div>

                  <div class="garage-readout tabular">
                    <div class="gr-main">
                      <div>
                        <span class="gr-label">CURRENT ODOMETER</span>
                        <div class="gr-odo">{{ activeGarageBike.odo }}</div>
                      </div>
                      <span class="gr-plate">PLATE // {{ activeGarageBike.plate }}</span>
                    </div>
                    <div class="gr-meta-grid">
                      <div>
                        <span class="gr-label">VIN IDENTIFIER</span>
                        <span class="gr-val">{{ activeGarageBike.vin }}</span>
                      </div>
                      <div>
                        <span class="gr-label">OWNERSHIP</span>
                        <span class="gr-val">{{ activeGarageBike.owned }}</span>
                      </div>
                      <div class="gr-wide">
                        <span class="gr-label">LATEST LOG ENTRY</span>
                        <span class="gr-val gr-highlight">{{ activeGarageBike.lastEvent }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <!-- BENTO 2 (Span 5): Interactive Reports & Fuel Economy (W / M / 3M / Y / A) -->
            <article class="double-bezel bento-span-5">
              <div class="double-bezel-core bento-card">
                <div class="bento-head">
                  <div class="bento-icon-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                      <path d="M4 20V10m6 10V4m6 16v-7m6 7v-4" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="bento-title">Fuel Economy &amp; Reports</h3>
                    <p class="bento-desc">
                      Filter mileage, total spend, and average L/100 km across W / M / 3M / Y / A windows.
                    </p>
                  </div>
                </div>

                <!-- Interactive Period Segmented Control -->
                <div class="reports-widget tabular">
                  <div class="period-segmented" role="tablist" aria-label="Report timeframe">
                    <button
                      v-for="(period, idx) in reportPeriods"
                      :key="period.key"
                      type="button"
                      role="tab"
                      :aria-selected="selectedPeriodIdx === idx"
                      class="seg-btn"
                      :class="{ 'is-active': selectedPeriodIdx === idx }"
                      @click="selectedPeriodIdx = idx"
                    >
                      {{ period.key }}
                    </button>
                  </div>

                  <div class="rw-kpis">
                    <div>
                      <span class="rw-lbl">MILEAGE</span>
                      <span class="rw-val rw-blue">{{ activeReportPeriod.mileage }}</span>
                    </div>
                    <div>
                      <span class="rw-lbl">EXPENSES</span>
                      <span class="rw-val rw-orange">{{ activeReportPeriod.expenses }}</span>
                    </div>
                    <div>
                      <span class="rw-lbl">AVG FUEL</span>
                      <span class="rw-val rw-green">{{ activeReportPeriod.fuel }}</span>
                    </div>
                  </div>

                  <div class="rw-bars">
                    <div v-for="bar in activeReportPeriod.bars" :key="bar.label" class="rw-bar-row">
                      <div class="rw-bar-meta">
                        <span>{{ bar.label }}</span>
                        <span>{{ bar.amount }}</span>
                      </div>
                      <div class="rw-bar-track">
                        <div
                          class="rw-bar-fill"
                          :style="{ width: `${bar.pct}%`, backgroundColor: bar.color }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <!-- BENTO 3 (Span 4): Mileage & Date Service Reminders -->
            <article class="double-bezel bento-span-4">
              <div class="double-bezel-core bento-card">
                <div class="bento-head">
                  <div class="bento-icon-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 7.5V12l3 2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="bento-title">Service Reminders</h3>
                    <p class="bento-desc">
                      Mileage rules (“every 5,000 km”) or date reminders with optional Apple Calendar sync.
                    </p>
                  </div>
                </div>

                <div class="reminder-widget tabular">
                  <div class="rem-header">
                    <span>ENGINE OIL &amp; FILTER</span>
                    <span class="rem-status" :class="{ 'is-ok': serviceDone }">
                      {{ serviceDone ? 'NEXT @ 50,422 KM' : 'DUE IN 578 KM' }}
                    </span>
                  </div>
                  <div class="rem-progress-track">
                    <div
                      class="rem-progress-fill"
                      :class="{ 'is-ok': serviceDone }"
                      :style="{ width: serviceDone ? '12%' : '88%' }"
                    ></div>
                  </div>
                  <div class="rem-footer">
                    <span>Interval: 5,000 km</span>
                    <button type="button" class="rem-action-btn" @click="toggleServiceReset">
                      {{ serviceDone ? 'Undo log' : 'Mark serviced' }}
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <!-- BENTO 4 (Span 4): Flexible Log & Camera Receipt Scanner -->
            <article class="double-bezel bento-span-4">
              <div class="double-bezel-core bento-card">
                <div class="bento-head">
                  <div class="bento-icon-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                      <rect x="4" y="3.5" width="16" height="17" rx="2.5" />
                      <path d="M8 8.5h8M8 12.5h8M8 16.5h5" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="bento-title">Flexible Log &amp; Receipts</h3>
                    <p class="bento-desc">
                      Log refuels, oil changes, washes, inspections, insurance, or custom types with scanned receipts.
                    </p>
                  </div>
                </div>

                <div class="log-feed-widget tabular">
                  <div class="log-item">
                    <span class="log-dot log-dot-orange"></span>
                    <span class="log-type">Oil Change</span>
                    <span class="log-odo">45,100 km</span>
                    <span class="log-tag">PDF Scan</span>
                  </div>
                  <div class="log-item">
                    <span class="log-dot log-dot-red"></span>
                    <span class="log-type">Refuel · 14.2 L</span>
                    <span class="log-odo">45,326 km</span>
                    <span class="log-tag">Receipt</span>
                  </div>
                  <div class="log-item">
                    <span class="log-dot log-dot-blue"></span>
                    <span class="log-type">GPS Ride</span>
                    <span class="log-odo">45,422 km</span>
                    <span class="log-tag">96.4 km</span>
                  </div>
                </div>
              </div>
            </article>

            <!-- BENTO 5 (Span 4): Vector PDF Exports + Siri & Widgets -->
            <article class="double-bezel bento-span-4">
              <div class="double-bezel-core bento-card">
                <div class="bento-head">
                  <div class="bento-icon-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                      <path d="M14 3.5H7A2.5 2.5 0 0 0 4.5 6v12A2.5 2.5 0 0 0 7 20.5h10a2.5 2.5 0 0 0 2.5-2.5V9L14 3.5z" stroke-linejoin="round" />
                      <path d="M14 3.5V9h5.5M8.5 14.5h7M8.5 17.5h4.5" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="bento-title">Vector PDFs &amp; Siri</h3>
                    <p class="bento-desc">
                      Export year-grouped Service History PDFs for resale, or log refuels hands-free with Siri.
                    </p>
                  </div>
                </div>

                <div class="pdf-siri-widget">
                  <div class="pdf-sheet-preview tabular">
                    <div class="pdf-sheet-top">
                      <span class="pdf-badge">VECTOR PDF</span>
                      <span>Honda_Shadow_750_History.pdf</span>
                    </div>
                    <div class="pdf-sheet-lines">
                      <span>2026 · 14 entries · Verified Odometer</span>
                    </div>
                  </div>
                  <div class="siri-command-bar">
                    <span class="siri-wave" aria-hidden="true">
                      <i></i><i></i><i></i><i></i>
                    </span>
                    <span class="siri-text">“Hey Siri, log a refuel in Odollet.”</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- SECTION 6: ZERO-SERVER PRIVACY & ARCHITECTURE DIAGRAM -->
      <section id="architecture" class="arch-section reveal-on-scroll">
        <div class="container">
          <div class="double-bezel">
            <div class="double-bezel-core arch-panel">
              <div class="arch-copy">
                <h2 class="arch-heading">
                  Your routes and garage stay on your hardware.
                </h2>
                <p class="arch-desc">
                  Odollet operates zero servers. There is no sign-up, no analytics SDK, no crash reporter, and no ad network. Everything lives in your iPhone’s encrypted sandbox — with optional end-to-end sync through your personal Apple iCloud database.
                </p>
                <div class="arch-links">
                  <RouterLink to="/privacy-policy" class="btn-cockpit-secondary">
                    <span>Read full Privacy &amp; Permissions Spec</span>
                  </RouterLink>
                </div>
              </div>

              <!-- Clean Architectural Flow Diagram -->
              <div class="arch-diagram tabular" aria-label="Data privacy architecture diagram">
                <div class="arch-node arch-node-primary">
                  <span class="arch-node-code">LOCAL SANDBOX // DEFAULT</span>
                  <strong>iPhone Encrypted Storage</strong>
                  <span>Bikes, logs, receipts &amp; compressed GPS tracks</span>
                </div>

                <div class="arch-connector">
                  <span class="arch-line"></span>
                  <span class="arch-pill">OPT-IN ONLY</span>
                  <span class="arch-line"></span>
                </div>

                <div class="arch-branches">
                  <div class="arch-node">
                    <span class="arch-node-code">APPLE CLOUDKIT</span>
                    <strong>Private iCloud Sync</strong>
                    <span>Your personal Apple ID database</span>
                  </div>
                  <div class="arch-node">
                    <span class="arch-node-code">PORTABLE EXPORT</span>
                    <strong>Vector PDF &amp; JSON Backup</strong>
                    <span>AirDrop, Files, or Print</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 7: FINAL INSTRUMENT CLUSTER CTA -->
      <section class="final-cta-section reveal-on-scroll">
        <div class="container">
          <div class="double-bezel">
            <div class="double-bezel-core final-cta-core">
              <div class="final-cta-glow" aria-hidden="true"></div>
              <img src="/images/AppIcon.jpg" alt="" class="final-cta-icon" aria-hidden="true" />
              <h2 class="final-cta-heading">
                Ready for the next ride.
              </h2>
              <p class="final-cta-sub">
                Free on the App Store for iPhone (iOS 17+). No account, no tracking, no ads.
              </p>
              <div class="final-cta-actions">
                <a :href="APP_STORE_URL" class="btn-redline" target="_blank" rel="noopener">
                  <span>Download Odollet on the App Store</span>
                  <span class="btn-circle-icon" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </a>
                <a :href="APP_STORE_URL" class="appstore-svg-link" target="_blank" rel="noopener" aria-label="Download on the App Store">
                  <img src="/images/appstore.svg" alt="Download on the App Store" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer class="cockpit-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand-col">
            <div class="footer-brand-row">
              <img src="/images/AppIcon.jpg" alt="" class="brand-icon" aria-hidden="true" />
              <span class="brand-logo">Odollet</span>
            </div>
            <p class="footer-tagline">
              The odometer wallet for motorcyclists who value mechanical clarity, accurate records, and more time on the road.
            </p>
          </div>

          <div class="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#telemetry">GPS Ride Telemetry</a></li>
              <li><a href="#cockpit">Cockpit Screens</a></li>
              <li><a href="#logbook">Garage &amp; Reports</a></li>
              <li><a href="#architecture">Privacy Architecture</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Legal &amp; Support</h4>
            <ul>
              <li><RouterLink to="/privacy-policy">Privacy Policy</RouterLink></li>
              <li><a :href="APP_STORE_URL" target="_blank" rel="noopener">App Store Listing</a></li>
              <li><a href="mailto:info@odollet.com">info@odollet.com</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom tabular">
          <p>&copy; {{ copyrightYears }} Odollet. All rights reserved.</p>
          <p>BUILT FOR IPHONE · ZERO TRACKING</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.cockpit-page {
  min-height: 100dvh;
  background-color: var(--bg-obsidian);
  color: var(--ink-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* --- FLOATING NAVIGATION ISLAND --- */
.nav-shell {
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 1.5rem;
  pointer-events: none;
}

.nav-island {
  pointer-events: auto;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.5rem 0.65rem 0.5rem 0.85rem;
  border-radius: 999px;
  background: rgba(14, 18, 27, 0.78);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--hairline-strong);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), var(--inner-highlight);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.nav-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: var(--ink-primary);
}

.brand-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.brand-logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.02em;
  color: var(--ink-primary);
}

.brand-odo {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--redline);
  background: rgba(255, 107, 0, 0.1);
  border: 1px solid rgba(255, 107, 0, 0.24);
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

.nav-links-desktop {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.nav-link {
  color: var(--ink-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 200ms var(--ease-out);
}

.nav-link:hover {
  color: var(--ink-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-island-sm {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.4rem 0.4rem 0.4rem 0.9rem;
  border-radius: 999px;
  background: var(--ink-primary);
  color: #090B10;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 160ms var(--ease-out), background-color 200ms var(--ease-out);
}

.btn-island-sm:hover {
  background: #ffffff;
}

.btn-island-sm:active {
  transform: scale(0.97);
}

.btn-island-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(9, 11, 16, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 220ms var(--ease-out);
}

.btn-island-icon svg {
  width: 13px;
  height: 13px;
}

.btn-island-sm:hover .btn-island-icon {
  transform: translate(1px, -1px) scale(1.06);
}

/* Mobile Burger & Drawer */
.nav-burger {
  display: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--hairline-strong);
  background: rgba(255, 255, 255, 0.04);
  color: var(--ink-primary);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 0;
}

.burger-line {
  width: 16px;
  height: 1.5px;
  background: currentColor;
  transition: transform 300ms var(--ease-out);
}

.nav-burger.is-open .burger-line:first-child {
  transform: translateY(3.25px) rotate(45deg);
}

.nav-burger.is-open .burger-line:last-child {
  transform: translateY(-3.25px) rotate(-45deg);
}

.mobile-drawer {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: -1;
  background: rgba(9, 11, 16, 0.94);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  opacity: 0;
  transition: opacity 320ms var(--ease-out);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.mobile-drawer.is-open {
  pointer-events: auto;
  opacity: 1;
}

.mobile-drawer-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.mobile-link {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--ink-primary);
  text-decoration: none;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 360ms var(--ease-out), transform 360ms var(--ease-out);
  transition-delay: calc(var(--i, 1) * 50ms);
}

.mobile-drawer.is-open .mobile-link,
.mobile-drawer.is-open .mobile-cta {
  opacity: 1;
  transform: translateY(0);
}

/* --- HERO SECTION --- */
.hero-section {
  position: relative;
  padding: 8.75rem 0 5.5rem;
  overflow: hidden;
}

.hero-ambient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(55% 50% at 72% 38%, rgba(255, 107, 0, 0.11) 0%, transparent 70%),
    radial-gradient(50% 50% at 25% 20%, rgba(30, 136, 255, 0.09) 0%, transparent 70%);
  pointer-events: none;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 3.5rem;
  align-items: center;
}

/* Mechanical Odometer Readout Bar */
.odo-cluster {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.45rem 0.9rem;
  border-radius: 12px;
  background: var(--bg-cockpit);
  border: 1px solid var(--hairline-strong);
  box-shadow: var(--inner-highlight);
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
}

.odo-drum-group {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.odo-label,
.odo-unit {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--ink-muted);
}

.odo-drums {
  display: inline-flex;
  gap: 2px;
}

.odo-drum {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 19px;
  height: 24px;
  padding: 0 3px;
  border-radius: 4px;
  background: #06080C;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink-primary);
  overflow: hidden;
}

.odo-drum-tenth {
  background: rgba(255, 107, 0, 0.16);
  border-color: rgba(255, 107, 0, 0.38);
  color: var(--redline-bright);
}

.odo-drum-value {
  display: inline-block;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 520ms var(--ease-out), opacity 400ms var(--ease-out);
  transition-delay: var(--delay, 0ms);
}

.odo-cluster.is-ready .odo-drum-value {
  transform: translateY(0);
  opacity: 1;
}

.odo-divider {
  width: 1px;
  height: 16px;
  background: var(--hairline-strong);
}

.odo-release {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--ink-secondary);
}

.odo-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--redline);
  box-shadow: 0 0 10px var(--redline);
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.65rem, 5vw, 4.25rem);
  font-weight: 700;
  line-height: 1.03;
  letter-spacing: -0.025em;
  color: var(--ink-primary);
  margin-bottom: 1.35rem;
  max-width: 14ch;
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.65;
  color: var(--ink-secondary);
  max-width: 54ch;
  margin-bottom: 2.25rem;
}

.hero-cta-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2.75rem;
}

.btn-redline {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 0.65rem 0.65rem 1.4rem;
  border-radius: 999px;
  background: var(--redline);
  color: #090B10;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: 0 12px 28px rgba(255, 107, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: transform 160ms var(--ease-out), background-color 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
}

.btn-redline:hover {
  background: var(--redline-bright);
  box-shadow: 0 16px 34px rgba(255, 107, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.btn-redline:active {
  transform: scale(0.97);
}

.btn-circle-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(9, 11, 16, 0.14);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 220ms var(--ease-out);
}

.btn-circle-icon svg {
  width: 15px;
  height: 15px;
}

.btn-redline:hover .btn-circle-icon {
  transform: translate(2px, -2px) scale(1.06);
}

.btn-cockpit-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.35rem;
  border-radius: 999px;
  background: var(--bg-panel);
  color: var(--ink-primary);
  border: 1px solid var(--hairline-strong);
  box-shadow: var(--inner-highlight);
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 160ms var(--ease-out), border-color 200ms var(--ease-out), background-color 200ms var(--ease-out);
}

.btn-cockpit-secondary:hover {
  background: var(--bg-panel-elevated);
  border-color: rgba(226, 234, 248, 0.28);
}

.btn-cockpit-secondary:active {
  transform: scale(0.97);
}

.hero-spec-strip {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 1.5rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--hairline);
}

.spec-cell dt {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--ink-muted);
  margin-bottom: 0.25rem;
}

.spec-cell dd {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink-primary);
}

/* Right Hero Stage: Tachometer + iPhone + HUD Selectors */
.hero-stage-col {
  display: flex;
  justify-content: center;
}

.tachometer-stage {
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tacho-svg {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 480px;
  height: 480px;
  pointer-events: none;
  z-index: 0;
}

.tacho-redline-arc {
  transition: stroke-dasharray 600ms var(--ease-out);
}

.iphone-double-bezel {
  position: relative;
  z-index: 2;
  width: 276px;
  padding: 8px;
  border-radius: 42px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.65),
    0 4px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.iphone-inner-core {
  border-radius: 34px;
  overflow: hidden;
  background: #090B10;
  border: 2px solid #090B10;
}

.iphone-screen-img {
  width: 100%;
  height: auto;
  display: block;
  transition: opacity 220ms var(--ease-out), filter 220ms var(--ease-out), transform 220ms var(--ease-out);
}

.iphone-screen-img.is-transitioning {
  opacity: 0.72;
  filter: blur(2px);
  transform: scale(0.985);
}

.hero-hud-selectors {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  width: 100%;
  margin-top: 1.25rem;
}

.hud-chip {
  text-align: left;
  padding: 0.7rem 0.8rem;
  border-radius: 14px;
  background: rgba(19, 25, 38, 0.88);
  border: 1px solid var(--hairline-strong);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35), var(--inner-highlight);
  color: var(--ink-primary);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  transition: transform 180ms var(--ease-out), border-color 200ms var(--ease-out), background-color 200ms var(--ease-out);
}

.hud-chip:hover {
  background: var(--bg-panel-elevated);
}

.hud-chip:active {
  transform: scale(0.97);
}

.hud-chip.is-active {
  border-color: var(--redline);
  background: rgba(255, 107, 0, 0.1);
}

.hud-chip-code {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
}

.hud-chip.is-active .hud-chip-code {
  color: var(--redline-bright);
}

.hud-chip-metric {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ink-primary);
}

.hud-chip-sub {
  font-size: 0.72rem;
  color: var(--ink-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- SHARED SECTION HEADERS & SCROLL REVEAL --- */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 680ms var(--ease-out), transform 680ms var(--ease-out);
}

.reveal-on-scroll.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

.section-header-split {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 3rem;
  align-items: end;
  margin-bottom: 3rem;
}

.section-heading {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.6vw, 3rem);
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
}

.section-lead {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--ink-secondary);
}

/* --- SECTION 2: GPS TELEMETRY CONSOLE --- */
.telemetry-section {
  padding: 6rem 0;
}

.telemetry-console {
  display: grid;
  grid-template-columns: 1.35fr 0.85fr;
  overflow: hidden;
}

.telemetry-map-stage {
  padding: 1.5rem;
  border-right: 1px solid var(--hairline);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    radial-gradient(70% 70% at 50% 45%, rgba(30, 136, 255, 0.06) 0%, transparent 75%),
    #0C1018;
}

.map-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ink-secondary);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--hairline);
}

.map-coord-group {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.status-led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--telemetry-blue);
  box-shadow: 0 0 10px var(--telemetry-blue);
}

.map-canvas-wrap {
  padding: 0.75rem 0;
}

.route-svg {
  width: 100%;
  height: auto;
  display: block;
}

.map-label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  fill: var(--ink-secondary);
}

.map-label-major {
  font-size: 12px;
  font-weight: 700;
  fill: var(--ink-primary);
}

.map-label-water {
  fill: rgba(30, 136, 255, 0.75);
  font-style: normal;
}

.telemetry-scrubber-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--hairline);
}

.scrubber-play-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: var(--redline);
  color: #090B10;
  border: none;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 150ms var(--ease-out), background-color 180ms var(--ease-out);
}

.scrubber-play-btn:hover {
  background: var(--redline-bright);
}

.scrubber-play-btn:active {
  transform: scale(0.97);
}

.scrubber-slider-wrap {
  flex: 1;
  display: flex;
  align-items: center;
}

.telemetry-range {
  width: 100%;
  accent-color: var(--redline);
  cursor: pointer;
}

.scrubber-waypoint {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-primary);
  min-width: 150px;
  text-align: right;
}

/* Telemetry Readout Right Column */
.telemetry-readout-col {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}

.telemetry-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
}

.telemetry-pct {
  color: var(--redline-bright);
  font-weight: 600;
}

.telemetry-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.telemetry-metric-box {
  padding: 0.9rem 1rem;
  border-radius: 14px;
  background: var(--bg-cockpit);
  border: 1px solid var(--hairline);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tm-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
}

.tm-value {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--ink-primary);
}

.tm-value small {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--ink-secondary);
}

.tm-accent {
  color: var(--redline-bright);
}

/* Lock Screen Live Activity Pill */
.live-activity-pill {
  padding: 1rem 1.15rem;
  border-radius: 20px;
  background: #080A0F;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}

.la-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.la-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--ink-secondary);
}

.la-icon {
  width: 18px;
  height: 18px;
  border-radius: 5px;
}

.la-rec {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 600;
  color: var(--telemetry-green);
}

.la-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--telemetry-green);
}

.la-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.la-val {
  display: block;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ink-primary);
}

.la-speed {
  color: var(--telemetry-blue);
}

.la-lbl {
  font-size: 0.7rem;
  color: var(--ink-muted);
}

.telemetry-privacy-note {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--ink-muted);
}

/* --- SECTION 3: STATEMENT WORD-BY-WORD SCROLL REVEAL --- */
.statement-section {
  padding: 7.5rem 0;
}

.statement-copy {
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 3.6vw, 3.1rem);
  font-weight: 600;
  line-height: 1.24;
  letter-spacing: -0.02em;
  max-width: 32ch;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.3em;
  row-gap: 0.1em;
}

.statement-word {
  display: inline-block;
  color: var(--ink-primary);
  opacity: 0.24;
  transition: opacity 360ms var(--ease-out), color 360ms var(--ease-out);
}

.statement-word.is-lit {
  opacity: 1;
}

.statement-word.is-accent {
  color: var(--redline-bright);
}

/* --- SECTION 4: 4-SCREEN INTERACTIVE COCKPIT SHOWCASE --- */
.cockpit-section {
  padding: 6rem 0;
}

.cockpit-showcase-grid {
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 2.5rem;
  align-items: stretch;
}

.cockpit-deck {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.cockpit-card-btn {
  text-align: left;
  padding: 1.35rem 1.5rem;
  border-radius: 20px;
  background: var(--bg-panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--inner-highlight);
  color: var(--ink-primary);
  cursor: pointer;
  transition: transform 180ms var(--ease-out), border-color 220ms var(--ease-out), background-color 220ms var(--ease-out);
}

.cockpit-card-btn:hover {
  background: var(--bg-panel-elevated);
  border-color: var(--hairline-strong);
}

.cockpit-card-btn:active {
  transform: scale(0.99);
}

.cockpit-card-btn.is-active {
  background: linear-gradient(180deg, rgba(255, 107, 0, 0.09) 0%, rgba(19, 25, 38, 0.95) 100%);
  border-color: var(--redline);
}

.cc-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.45rem;
}

.cc-index {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
}

.cockpit-card-btn.is-active .cc-index {
  color: var(--redline-bright);
}

.cc-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: var(--redline-dim);
  color: var(--redline-bright);
  border: 1px solid rgba(255, 107, 0, 0.3);
}

.cc-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: var(--ink-primary);
}

.cc-caption {
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--ink-secondary);
  margin-bottom: 1rem;
}

.cc-specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--hairline);
}

.cc-spec-lbl {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--ink-muted);
  margin-bottom: 0.15rem;
}

.cc-spec-val {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink-primary);
}

.cockpit-stage-bezel {
  height: 100%;
}

.cockpit-stage-core {
  height: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background:
    radial-gradient(65% 55% at 50% 50%, rgba(255, 107, 0, 0.1) 0%, transparent 70%),
    #0C1018;
}

.stage-top-telemetry {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ink-muted);
  margin-bottom: 1rem;
}

.stage-phone-frame {
  width: 268px;
  padding: 7px;
  border-radius: 38px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.6);
}

.stage-phone-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 31px;
  transition: opacity 220ms var(--ease-out), filter 220ms var(--ease-out), transform 220ms var(--ease-out);
}

.stage-phone-img.is-switching {
  opacity: 0.72;
  filter: blur(2px);
  transform: scale(0.985);
}

.stage-dots {
  display: flex;
  gap: 0.45rem;
  margin-top: 1.25rem;
}

.stage-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  transition: width 240ms var(--ease-out), background-color 240ms var(--ease-out);
}

.stage-dot.is-active {
  width: 24px;
  background: var(--redline);
}

/* --- SECTION 5: ENGINEERED BENTO GRID --- */
.bento-section {
  padding: 6rem 0;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.25rem;
}

.bento-span-7 {
  grid-column: span 7;
}

.bento-span-5 {
  grid-column: span 5;
}

.bento-span-4 {
  grid-column: span 4;
}

.bento-card {
  height: 100%;
  padding: 1.65rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}

.bento-head {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.bento-icon-box {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--bg-cockpit);
  border: 1px solid var(--hairline-strong);
  color: var(--redline-bright);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.bento-icon-box svg {
  width: 22px;
  height: 22px;
}

.bento-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ink-primary);
  margin-bottom: 0.35rem;
}

.bento-desc {
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--ink-secondary);
}

/* Garage Interactive Widget */
.garage-widget {
  background: var(--bg-cockpit);
  border: 1px solid var(--hairline);
  border-radius: 14px;
  padding: 1rem;
}

.garage-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.garage-tab {
  padding: 0.5rem 0.65rem;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--hairline);
  color: var(--ink-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 180ms var(--ease-out), border-color 180ms var(--ease-out), color 180ms var(--ease-out);
}

.garage-tab.is-active {
  background: var(--redline-dim);
  border-color: rgba(255, 107, 0, 0.4);
  color: var(--ink-primary);
}

.gr-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 0.85rem;
  margin-bottom: 0.85rem;
  border-bottom: 1px solid var(--hairline);
}

.gr-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
  margin-bottom: 0.2rem;
}

.gr-odo {
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--ink-primary);
}

.gr-plate {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--hairline-strong);
}

.gr-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.gr-wide {
  grid-column: span 2;
}

.gr-val {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--ink-secondary);
}

.gr-highlight {
  color: var(--telemetry-blue);
}

/* Reports Interactive Widget */
.reports-widget {
  background: var(--bg-cockpit);
  border: 1px solid var(--hairline);
  border-radius: 14px;
  padding: 1rem;
}

.period-segmented {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 10px;
  background: #080A0F;
  border: 1px solid var(--hairline);
  margin-bottom: 0.9rem;
}

.seg-btn {
  padding: 0.3rem 0;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: var(--ink-secondary);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 180ms var(--ease-out), color 180ms var(--ease-out);
}

.seg-btn.is-active {
  background: var(--bg-panel-elevated);
  color: var(--ink-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}

.rw-kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.9rem;
}

.rw-lbl {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--ink-muted);
}

.rw-val {
  font-family: var(--font-display);
  font-size: 0.98rem;
  font-weight: 700;
}

.rw-blue { color: var(--telemetry-blue); }
.rw-orange { color: var(--redline-bright); }
.rw-green { color: var(--telemetry-green); }

.rw-bars {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.rw-bar-meta {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--ink-secondary);
  margin-bottom: 0.15rem;
}

.rw-bar-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.rw-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 360ms var(--ease-out);
}

/* Reminder Widget */
.reminder-widget {
  background: var(--bg-cockpit);
  border: 1px solid var(--hairline);
  border-radius: 14px;
  padding: 1rem;
}

.rem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
}

.rem-status {
  color: var(--redline-bright);
}

.rem-status.is-ok {
  color: var(--telemetry-green);
}

.rem-progress-track {
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.rem-progress-fill {
  height: 100%;
  background: var(--redline);
  border-radius: 999px;
  transition: width 420ms var(--ease-out), background-color 300ms var(--ease-out);
}

.rem-progress-fill.is-ok {
  background: var(--telemetry-green);
}

.rem-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.76rem;
  color: var(--ink-muted);
}

.rem-action-btn {
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--hairline-strong);
  background: var(--bg-panel-elevated);
  color: var(--ink-primary);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
}

/* Log Feed Widget */
.log-feed-widget {
  background: var(--bg-cockpit);
  border: 1px solid var(--hairline);
  border-radius: 14px;
  padding: 0.75rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.log-item {
  display: grid;
  grid-template-columns: 10px 1fr auto auto;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.76rem;
  padding-bottom: 0.45rem;
  border-bottom: 1px solid var(--hairline);
}

.log-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.log-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.log-dot-orange { background: var(--redline); }
.log-dot-red { background: #F43F5E; }
.log-dot-blue { background: var(--telemetry-blue); }

.log-type {
  font-weight: 600;
  color: var(--ink-primary);
}

.log-odo {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--ink-muted);
}

.log-tag {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  padding: 0.12rem 0.4rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--ink-secondary);
}

/* PDF & Siri Widget */
.pdf-siri-widget {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.pdf-sheet-preview {
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  background: var(--bg-cockpit);
  border: 1px solid var(--hairline);
}

.pdf-sheet-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--ink-primary);
  margin-bottom: 0.25rem;
}

.pdf-badge {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: var(--telemetry-blue-dim);
  color: var(--telemetry-blue);
}

.pdf-sheet-lines {
  font-size: 0.72rem;
  color: var(--ink-muted);
}

.siri-command-bar {
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  background: #080A0F;
  border: 1px solid var(--hairline);
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.siri-wave {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.siri-wave i {
  display: inline-block;
  width: 2.5px;
  height: 12px;
  border-radius: 2px;
  background: var(--redline);
}

.siri-wave i:nth-child(2) { height: 18px; background: var(--telemetry-blue); }
.siri-wave i:nth-child(3) { height: 14px; background: var(--telemetry-green); }
.siri-wave i:nth-child(4) { height: 9px; }

.siri-text {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--ink-secondary);
}

/* --- SECTION 6: PRIVACY ARCHITECTURE --- */
.arch-section {
  padding: 5rem 0;
}

.arch-panel {
  padding: 3rem;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 3rem;
  align-items: center;
}

.arch-heading {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.4rem);
  font-weight: 700;
  line-height: 1.08;
  margin-bottom: 1rem;
}

.arch-desc {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--ink-secondary);
  margin-bottom: 1.75rem;
}

.arch-diagram {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.arch-node {
  padding: 1.1rem 1.25rem;
  border-radius: 14px;
  background: var(--bg-cockpit);
  border: 1px solid var(--hairline-strong);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.arch-node-primary {
  border-color: var(--telemetry-green);
  background: linear-gradient(180deg, rgba(34, 197, 94, 0.08) 0%, var(--bg-cockpit) 100%);
}

.arch-node-code {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
}

.arch-node strong {
  font-family: var(--font-display);
  font-size: 1.05rem;
  color: var(--ink-primary);
}

.arch-node span:last-child {
  font-size: 0.8rem;
  color: var(--ink-secondary);
}

.arch-connector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
}

.arch-line {
  flex: 1;
  height: 1px;
  background: var(--hairline-strong);
}

.arch-pill {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--bg-cockpit);
  border: 1px solid var(--hairline-strong);
  color: var(--ink-secondary);
}

.arch-branches {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

/* --- SECTION 7: FINAL CTA --- */
.final-cta-section {
  padding: 4rem 0 6.5rem;
}

.final-cta-core {
  position: relative;
  overflow: hidden;
  padding: 4.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.final-cta-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(50% 60% at 50% 0%, rgba(255, 107, 0, 0.14) 0%, transparent 70%);
  pointer-events: none;
}

.final-cta-icon {
  width: 76px;
  height: 76px;
  border-radius: 18px;
  margin-bottom: 1.5rem;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.final-cta-heading {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.8vw, 3rem);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.final-cta-sub {
  font-size: 1.05rem;
  color: var(--ink-secondary);
  margin-bottom: 2rem;
}

.final-cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.appstore-svg-link img {
  height: 46px;
  width: auto;
  display: block;
}

/* --- FOOTER --- */
.cockpit-footer {
  border-top: 1px solid var(--hairline);
  background: #06080C;
  padding: 4rem 0 2.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-brand-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.85rem;
}

.footer-tagline {
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--ink-secondary);
  max-width: 36ch;
}

.footer-col h4 {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 1rem;
}

.footer-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-col a {
  color: var(--ink-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 180ms var(--ease-out);
}

.footer-col a:hover {
  color: var(--ink-primary);
}

.footer-bottom {
  padding-top: 1.5rem;
  border-top: 1px solid var(--hairline);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-muted);
}

/* --- RESPONSIVE COLLAPSE --- */
@media (max-width: 1024px) {
  .hero-grid,
  .telemetry-console,
  .cockpit-showcase-grid,
  .arch-panel {
    grid-template-columns: 1fr;
  }

  .telemetry-map-stage {
    border-right: none;
    border-bottom: 1px solid var(--hairline);
  }

  .bento-span-7,
  .bento-span-5,
  .bento-span-4 {
    grid-column: span 12;
  }

  .section-header-split {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1.25rem;
  }

  .nav-links-desktop,
  .brand-odo {
    display: none;
  }

  .nav-burger {
    display: inline-flex;
  }

  .hero-section {
    padding: 7rem 0 4rem;
  }

  .hero-spec-strip {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .hero-hud-selectors {
    grid-template-columns: 1fr;
  }

  .tacho-svg {
    width: 340px;
    height: 340px;
    top: 0;
  }

  .telemetry-scrubber-bar {
    flex-wrap: wrap;
  }

  .scrubber-waypoint {
    width: 100%;
    text-align: left;
  }

  .cc-specs,
  .arch-branches,
  .footer-grid,
  .garage-tabs {
    grid-template-columns: 1fr;
  }

  .arch-panel {
    padding: 1.75rem;
  }
}
</style>
