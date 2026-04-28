<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'

const isVisible = ref(false)

const COPYRIGHT_START_YEAR = 2025
const copyrightYears = computed(() => {
  const now = new Date().getFullYear()
  return now > COPYRIGHT_START_YEAR ? `${COPYRIGHT_START_YEAR}-${now}` : `${COPYRIGHT_START_YEAR}`
})

const APP_STORE_URL = 'https://apps.apple.com/app/id6751579293'

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

const features = [
  {
    icon: '🛰️',
    title: 'GPS Ride Tracking',
    description: 'Tap "Ride!" and Odollet records your route on the map with distance, duration, moving time, average and max speed, and elevation gain.',
    isNew: true,
  },
  {
    icon: '🏍️',
    title: 'Multi-Bike Garage',
    description: 'Add every motorcycle you own with VIN, license plate, purchase info, and a full-width hero photo. Switch between bikes in a tap.',
  },
  {
    icon: '⛽',
    title: 'Fuel Economy',
    description: 'Capture volume and price per liter on refuels. See your average L/100 km right in Reports and spot when the numbers drift.',
  },
  {
    icon: '📝',
    title: 'Flexible Log Entries',
    description: 'Log washes, oil changes, inspections, refuels, insurance, rides, or define your own custom types with icons. Attach photos or scan receipts on the spot.',
  },
  {
    icon: '📊',
    title: 'Reports & Charts',
    description: 'W / M / 3M / Y / A breakdowns for mileage and expenses. Apple Fitness-style summary cards plus category charts.',
  },
  {
    icon: '🛠️',
    title: 'Service Reminders',
    description: 'Mileage-based ("every 5000 km") or date-based reminders. Insurance and registration expiries auto-create them; optional Apple Calendar sync.',
  },
  {
    icon: '📄',
    title: 'PDF Exports',
    description: 'Share a year-grouped Service History or a one-page Motorcycle Profile as a crisp, vector-rendered PDF.',
  },
  {
    icon: '☁️',
    title: 'Optional iCloud Sync',
    description: 'Flip one switch to sync bikes, entries, photos, and reminders across your Apple devices via your own private iCloud database. Off by default.',
  },
  {
    icon: '🎤',
    title: 'Siri & Widgets',
    description: '"Hey Siri, log a refuel in Odollet." Ask for current mileage. Home Screen widget shows your active bike at a glance.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'No account, no tracking, no ads, no third-party analytics. Every cloud feature is opt-in - your data stays yours.',
  }
]

const screenshots = [
  {
    src: '/images/odollet_1.4.0_1.jpeg',
    alt: 'Odollet home screen with My Garage, mileage and expense charts, and a Ride button',
    title: 'My Garage',
    caption: 'Your active bike, this month\'s mileage and expenses, and one-tap access to a GPS Ride or a quick log entry.'
  },
  {
    src: '/images/odollet_1.4.0_3.jpeg',
    alt: 'Ride details screen with a map of the route around Reykjavik and ride statistics',
    title: 'GPS Rides',
    caption: 'Track each ride on the map with distance, duration, average and max speed, and elevation gain - then save it to history.',
    badge: 'New in 1.4.0'
  },
  {
    src: '/images/odollet_1.4.0_2.jpeg',
    alt: 'Reports screen with total mileage, expenses, average fuel consumption and expense breakdown chart',
    title: 'Reports',
    caption: 'Mileage, total spend, average L/100 km and an expense-by-type breakdown - all at a glance, filtered by W / M / 3M / Y / A.'
  },
  {
    src: '/images/odollet_1.4.0_4.jpeg',
    alt: 'Honda Shadow 750 motorcycle profile with VIN, license plate, ownership and service history link',
    title: 'Bike Profile',
    caption: 'Make, model, year, current mileage, license plate and purchase date - with a one-tap link to the full Service History PDF.'
  }
]

</script>

<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-container">
        <RouterLink to="/" class="nav-brand" aria-label="Odollet home">
          <img src="/images/AppIcon.jpg" alt="" class="brand-icon" aria-hidden="true" />
          <span class="brand-logo">Odollet</span>
        </RouterLink>
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#screenshots">Screenshots</a>
          <RouterLink to="/privacy-policy">Privacy</RouterLink>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero" :class="{ 'visible': isVisible }">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-container">
        <div class="hero-content">
          <span class="hero-badge">
            <span class="hero-badge-dot"></span>
            New in 1.4.0 - GPS Ride tracking
          </span>
          <h1 class="hero-title">
            The odometer wallet that <span class="gradient-text">rides with you</span>
          </h1>
          <p class="hero-subtitle">
            A focused iPhone logbook for every motorcyclist. Track rides on the map, log mileage, fuel and service, and export your history - perfectly organized, always at hand.
          </p>
          <div class="hero-buttons">
            <a :href="APP_STORE_URL" class="app-store-badge" target="_blank" rel="noopener">
              <img src="/images/appstore.svg" alt="Download Odollet on the App Store" />
            </a>
            <a href="#features" class="btn-ghost">See features</a>
          </div>
          <p class="hero-meta">Free - iOS 17+ - No account, no tracking, no ads</p>
        </div>
        <div class="hero-image">
          <div class="phone-mockup">
            <img
              src="/images/odollet_1.4.0_1.jpeg"
              alt="Odollet home screen with the My Garage view"
              class="phone-screenshot"
            />
            <div class="phone-glow" aria-hidden="true"></div>
          </div>
          <div class="hero-icon-card" aria-hidden="true">
            <img src="/images/AppIcon.jpg" alt="" class="hero-icon" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="features">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Features</span>
          <h2 class="section-title">Everything you need on the road</h2>
          <p class="section-subtitle">
            Odollet keeps every motorcycle record organized and accessible, so you spend less time tracking and more time riding.
          </p>
        </div>
        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card"
            :class="{ 'is-new': feature.isNew }"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">
              {{ feature.title }}
              <span v-if="feature.isNew" class="new-tag">New</span>
            </h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Screenshots -->
    <section id="screenshots" class="screenshots">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Screenshots</span>
          <h2 class="section-title">See the app in action</h2>
          <p class="section-subtitle">
            Clean, native iOS interface designed for everyday motorcycle journaling.
          </p>
        </div>
        <div class="screenshots-grid">
          <figure
            v-for="(shot, index) in screenshots"
            :key="index"
            class="screenshot-item"
          >
            <div class="screenshot-frame">
              <img
                :src="shot.src"
                :alt="shot.alt"
                class="screenshot"
                loading="lazy"
              />
              <span v-if="shot.badge" class="screenshot-badge">{{ shot.badge }}</span>
            </div>
            <figcaption>
              <h3>{{ shot.title }}</h3>
              <p>{{ shot.caption }}</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container">
        <div class="cta-card">
          <img src="/images/AppIcon.jpg" alt="" class="cta-icon" aria-hidden="true" />
          <h2>Start your motorcycle logbook</h2>
          <p>Free on the App Store. No account, no tracking, no ads.</p>
          <div class="cta-buttons">
            <a :href="APP_STORE_URL" class="app-store-badge" target="_blank" rel="noopener">
              <img src="/images/appstore.svg" alt="Download Odollet on the App Store" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section footer-brand">
            <div class="footer-brand-row">
              <img src="/images/AppIcon.jpg" alt="" class="brand-icon" aria-hidden="true" />
              <span class="brand-logo">Odollet</span>
            </div>
            <p>The odometer wallet for motorcyclists who value order, clarity, and more time on the road.</p>
          </div>
          <div class="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><RouterLink to="/privacy-policy">Privacy Policy</RouterLink></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Contact</h4>
            <p>Download <a :href="APP_STORE_URL" class="footer-link" target="_blank" rel="noopener">our app</a> for more information.</p>
            <p>Support: <a href="mailto:info@odollet.com" class="footer-link">info@odollet.com</a></p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ copyrightYears }} Odollet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing-page {
  font-family: var(--font-sans);
  color: var(--ink-700);
}

/* Navigation */
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(11, 16, 32, 0.06);
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.875rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  color: var(--ink-900);
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 22%;
  object-fit: cover;
  box-shadow: 0 6px 14px rgba(11, 16, 32, 0.18);
  background: #fff;
}

.brand-logo {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.4rem;
  letter-spacing: 0.01em;
  color: var(--ink-900);
  line-height: 1;
}

.nav-links {
  display: flex;
  gap: 1.75rem;
  align-items: center;
}

.nav-links a {
  color: var(--ink-500);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--ink-900);
}

/* Hero */
.hero {
  position: relative;
  isolation: isolate;
  padding: 9rem 2rem 6rem;
  color: #fff;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.hero.visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: var(--hero-grad);
  z-index: -1;
}

.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 0%, transparent 75%);
  pointer-events: none;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1.5rem;
  backdrop-filter: blur(8px);
}

.hero-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #5BE5A0;
  box-shadow: 0 0 10px rgba(91, 229, 160, 0.7);
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
  color: #fff;
}

.gradient-text {
  background: linear-gradient(95deg, #B8C0FF 0%, #E5B7F8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.78);
  max-width: 32rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.hero-meta {
  margin-top: 1.25rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.01em;
}

.app-store-badge {
  display: inline-block;
  transition: transform 0.2s ease, filter 0.2s ease;
  cursor: pointer;
}

.app-store-badge img {
  height: 50px;
  width: auto;
  display: block;
}

.app-store-badge:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.btn-ghost {
  padding: 0.85rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.05);
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

/* Hero phone */
.hero-image {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.phone-mockup {
  position: relative;
  max-width: 280px;
  width: 100%;
  border-radius: 36px;
  padding: 8px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow:
    0 30px 60px rgba(11, 16, 32, 0.55),
    0 12px 24px rgba(91, 107, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transform: rotate(-1.5deg);
  transition: transform 0.5s ease;
}

.phone-mockup:hover {
  transform: rotate(0deg) translateY(-4px);
}

.phone-screenshot {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 30px;
}

.phone-glow {
  position: absolute;
  inset: -30% -20% -20% -20%;
  background: radial-gradient(closest-side, rgba(184, 71, 226, 0.35) 0%, transparent 70%);
  z-index: -1;
  filter: blur(30px);
}

.hero-icon-card {
  position: absolute;
  bottom: -18px;
  right: -8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 22px;
  box-shadow: 0 18px 40px rgba(11, 16, 32, 0.45);
  transform: rotate(6deg);
}

.hero-icon {
  width: 64px;
  height: 64px;
  display: block;
  border-radius: 22%;
}

/* Sections */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-head {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 4rem;
}

.eyebrow {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-500);
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(91, 107, 255, 0.08);
  margin-bottom: 1rem;
}

.section-title {
  font-size: clamp(1.85rem, 3.4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink-900);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--ink-500);
}

/* Features */
.features {
  padding: 7rem 2rem;
  background: var(--ink-50);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.feature-card {
  background: #fff;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(11, 16, 32, 0.05);
  box-shadow: 0 1px 2px rgba(11, 16, 32, 0.03), 0 8px 24px rgba(11, 16, 32, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  position: relative;
  overflow: hidden;
}

.feature-card.is-new {
  background: linear-gradient(180deg, #fff 0%, #fff 100%) padding-box,
              var(--ride-grad) border-box;
  border: 1px solid transparent;
  box-shadow: 0 1px 2px rgba(91, 107, 255, 0.08), 0 12px 32px rgba(91, 107, 255, 0.12);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 1px 2px rgba(11, 16, 32, 0.04), 0 16px 40px rgba(11, 16, 32, 0.08);
  border-color: rgba(91, 107, 255, 0.2);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(91, 107, 255, 0.1) 0%, rgba(184, 71, 226, 0.08) 100%);
}

.feature-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--ink-900);
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.new-tag {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: var(--ride-grad);
  color: #fff;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.feature-description {
  color: var(--ink-500);
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Screenshots */
.screenshots {
  padding: 7rem 2rem;
  background: #fff;
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 3rem 2rem;
}

.screenshot-item {
  text-align: center;
  margin: 0;
}

.screenshot-frame {
  position: relative;
  display: inline-block;
  padding: 6px;
  border-radius: 30px;
  background: linear-gradient(180deg, #f5f6fa 0%, #e5e8f0 100%);
  box-shadow: 0 24px 48px rgba(11, 16, 32, 0.16), 0 6px 12px rgba(11, 16, 32, 0.06);
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.screenshot-frame:hover {
  transform: translateY(-6px);
  box-shadow: 0 32px 60px rgba(11, 16, 32, 0.2), 0 8px 16px rgba(11, 16, 32, 0.08);
}

.screenshot {
  width: 100%;
  max-width: 240px;
  height: auto;
  border-radius: 24px;
  display: block;
}

.screenshot-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: var(--ride-grad);
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(91, 107, 255, 0.4);
}

.screenshot-item h3 {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--ink-900);
}

.screenshot-item p {
  color: var(--ink-500);
  line-height: 1.55;
  font-size: 0.95rem;
  max-width: 28rem;
  margin: 0 auto;
}

/* CTA */
.cta {
  padding: 5rem 2rem 7rem;
  background: var(--ink-50);
}

.cta-card {
  position: relative;
  isolation: isolate;
  max-width: 760px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background: var(--hero-grad);
  border-radius: 28px;
  text-align: center;
  color: #fff;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(11, 16, 32, 0.25);
}

.cta-icon {
  width: 80px;
  height: 80px;
  border-radius: 22%;
  margin: 0 auto 1.5rem;
  display: block;
  box-shadow: 0 12px 28px rgba(11, 16, 32, 0.4);
}

.cta-card h2 {
  font-size: clamp(1.85rem, 3vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
}

.cta-card p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.78);
}

.cta-buttons {
  display: flex;
  justify-content: center;
}

/* Footer */
.footer {
  background: var(--ink-900);
  color: rgba(255, 255, 255, 0.7);
  padding: 4rem 2rem 1.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2.5rem;
}

.footer-brand-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
}

.footer-brand-row .brand-logo {
  color: #fff;
}

.footer-section h4 {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
}

.footer-section p,
.footer-section li {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.65;
  font-size: 0.95rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section a:hover {
  color: #fff;
}

.footer-link {
  color: var(--brand-500);
  font-weight: 500;
}

.footer-link:hover {
  color: #fff;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1.25rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 900px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }

  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-icon-card {
    bottom: -14px;
    right: 50%;
    transform: translateX(110px) rotate(6deg);
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0.75rem 1rem;
  }

  .nav-links {
    gap: 1.25rem;
  }

  .hero {
    padding: 7rem 1.25rem 4rem;
  }

  .features,
  .screenshots {
    padding: 4.5rem 1.25rem;
  }

  .cta {
    padding: 3.5rem 1rem 5rem;
  }

  .cta-card {
    padding: 3rem 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .screenshots-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 2.5rem 1.25rem;
  }
}

@media (max-width: 480px) {
  .nav-links {
    gap: 0.85rem;
    font-size: 0.85rem;
  }

  .brand-logo {
    font-size: 1.2rem;
  }

  .brand-icon {
    width: 32px;
    height: 32px;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .hero-buttons .app-store-badge,
  .hero-buttons .btn-ghost {
    width: 100%;
    text-align: center;
  }

  .app-store-badge img {
    height: 46px;
    margin: 0 auto;
  }

  .hero-icon-card {
    transform: translateX(80px) rotate(6deg);
  }

  .hero-icon {
    width: 52px;
    height: 52px;
  }
}
</style>
