<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const isVisible = ref(false)

// Copyright range: show "2025" in the launch year, then "2025 – current year"
// from the next January onwards. Recomputed on page load so the footer stays
// correct without a deploy.
const COPYRIGHT_START_YEAR = 2025
const copyrightYears = computed(() => {
  const now = new Date().getFullYear()
  return now > COPYRIGHT_START_YEAR ? `${COPYRIGHT_START_YEAR}–${now}` : `${COPYRIGHT_START_YEAR}`
})

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

const features = [
  {
    icon: '🏍️',
    title: 'Ride Logging',
    description: 'Record all your rides with date, mileage, cost, and notes. Track your journey from the very first kilometer.'
  },
  {
    icon: '💰',
    title: 'Expense Tracking',
    description: 'Log all motorcycle expenses including fuel, maintenance, insurance, and custom activities with detailed breakdowns.'
  },
  {
    icon: '📊',
    title: 'Visual Reports',
    description: 'See clean monthly cards and yearly charts showing how much you rode and spent. Understand your riding patterns.'
  },
  {
    icon: '📋',
    title: 'Maintenance History',
    description: 'Keep complete records of all maintenance activities and inspections for each motorcycle.'
  },
  {
    icon: '📱',
    title: 'Privacy First',
    description: 'All data stored locally on your device. No accounts, no ads, no tracking. You control your information.'
  },
  {
    icon: '💾',
    title: 'Backup & Restore',
    description: 'Export your data to JSON and save it securely. Import backups to restore everything on a new device.'
  }
]

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-container">
        <div class="nav-brand">
          <h2>Odollet</h2>
        </div>
        <div class="nav-links">
          <a href="#features" @click.prevent="scrollToSection('features')">Features</a>
          <a href="#screenshots" @click.prevent="scrollToSection('screenshots')">Screenshots</a>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero" :class="{ 'visible': isVisible }">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            Odometer Wallet for Motorcyclists
          </h1>
          <p class="hero-subtitle">
            The smart, easy-to-use journal for every motorcyclist who values order, clarity, and more time on the road. 
            Keep all your motorcycle records safe, neat, and accessible whenever you need them.
          </p>
          <div class="hero-buttons">
            <button class="btn-primary" @click="scrollToSection('screenshots')">
              View Screenshots
            </button>
            <button class="btn-secondary" @click="scrollToSection('features')">
              Learn More
            </button>
          </div>
        </div>
        <div class="hero-image">
          <div class="phone-mockup">
            <img 
              src="/images/01.png" 
              alt="Odollet App Home Screen"
              class="phone-screenshot"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">Everything You Need for Motorcycle Management</h2>
        <p class="section-subtitle">
          Odollet keeps all your motorcycle records organized and accessible, helping you spend less time tracking and more time riding
        </p>
        <div class="features-grid">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="feature-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Screenshots Section -->
    <section id="screenshots" class="screenshots">
      <div class="container">
        <h2 class="section-title">See the App in Action</h2>
        <p class="section-subtitle">
          Explore the clean, intuitive interface designed for everyday motorcycle journaling
        </p>
        <div class="screenshots-grid">
          <div class="screenshot-item">
            <img 
              src="/images/01.png" 
              alt="App Home Screen with motorcycle stats"
              class="screenshot"
            />
            <h3>Home Dashboard</h3>
            <p>Track your monthly mileage and expenses at a glance</p>
          </div>
          <div class="screenshot-item">
            <img 
              src="/images/02.png" 
              alt="Ride logging interface"
              class="screenshot"
            />
            <h3>Ride Logging</h3>
            <p>Quickly add ride details with date, mileage, and notes</p>
          </div>
          <div class="screenshot-item">
            <img 
              src="/images/03.png" 
              alt="Expense tracking"
              class="screenshot"
            />
            <h3>Expense Tracking</h3>
            <p>Log all motorcycle costs with category and details</p>
          </div>
          <div class="screenshot-item">
            <img 
              src="/images/04.png" 
              alt="Reports and analytics"
              class="screenshot"
            />
            <h3>Reports</h3>
            <p>Visualize your riding and spending patterns over time</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Organize Your Motorcycle Life?</h2>
          <p>Download Odollet today and keep your motorcycle records perfectly logged from the very first kilometer to the longest journey</p>
          <div class="cta-buttons">
            <a href="https://apps.apple.com/app/id6751579293" class="app-store-badge" target="_blank" rel="noopener">
              <img src="/images/appstore.svg" alt="Download on the App Store" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Odollet</h3>
            <p>The smart odometer wallet for motorcyclists who value order, clarity, and more time on the road.</p>
          </div>
          <div class="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Contact</h4>
            <p>Download <a href="https://apps.apple.com/app/id6751579293" class="footer-app-link" target="_blank" rel="noopener">our app</a> for more information</p>
            <p>For support and questions: <a href="mailto:info@odollet.com" class="footer-email-link">info@odollet.com</a></p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ copyrightYears }} Odollet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>)
  <style scoped>
.landing-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h2 {
  margin: 0;
  color: #1a365d;
  font-weight: 700;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #2d3748;
}

/* Hero Section */
.hero {
  padding: 8rem 2rem 4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.hero.visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.app-store-badge {
  display: inline-block;
  transition: all 0.3s ease;
  cursor: pointer;
}

.app-store-badge img {
  height: 50px;
  width: auto;
  transition: all 0.3s ease;
}

.app-store-badge:hover {
  transform: translateY(-2px);
}

.app-store-badge:hover img {
  filter: brightness(1.1);
}

.footer-app-link {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.footer-app-link:hover {
  color: #764ba2;
  border-bottom-color: #764ba2;
}

.footer-email-link {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.footer-email-link:hover {
  color: #764ba2;
  border-bottom-color: #764ba2;
}

/* Responsive design for App Store badge */
@media (max-width: 768px) {
  .app-store-badge img {
    height: 45px;
  }
}

@media (max-width: 480px) {
  .app-store-badge img {
    height: 40px;
  }
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.hero-image {
  display: flex;
  justify-content: center;
}

.phone-mockup {
  position: relative;
  max-width: 300px;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
}

.phone-screenshot {
  width: 100%;
  height: auto;
  border-radius: 25px;
}

/* Features Section */
.features {
  padding: 6rem 2rem;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: #1a365d;
}

.section-subtitle {
  font-size: 1.25rem;
  text-align: center;
  color: #4a5568;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(30px);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a365d;
}

.feature-description {
  color: #4a5568;
  line-height: 1.6;
}

/* Screenshots Section */
.screenshots {
  padding: 6rem 2rem;
  background: white;
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.screenshot-item {
  text-align: center;
}

.screenshot {
  width: 100%;
  max-width: 250px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.screenshot:hover {
  transform: scale(1.05);
}

.screenshot-item h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a365d;
}

.screenshot-item p {
  color: #4a5568;
  line-height: 1.5;
}

/* CTA Section */
.cta {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
  color: white;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.cta-buttons .btn-primary {
  background: #667eea;
  color: white;
  font-size: 1.1rem;
  padding: 1.25rem 2.5rem;
}

.cta-buttons .btn-primary:hover {
  background: #5a67d8;
}

/* Footer */
.footer {
  background: #1a202c;
  color: white;
  padding: 3rem 2rem 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3, .footer-section h4 {
  margin-bottom: 1rem;
  color: #e2e8f0;
}

.footer-section p, .footer-section li {
  color: #a0aec0;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section a {
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #e2e8f0;
}

.footer-bottom {
  border-top: 1px solid #2d3748;
  padding-top: 1rem;
  text-align: center;
  color: #718096;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .screenshots-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-content h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .nav-links {
    flex-direction: column;
    gap: 0.5rem;
  }

  .hero {
    padding: 6rem 1rem 3rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .btn-primary, .btn-secondary {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }

  .features, .screenshots, .cta {
    padding: 4rem 1rem;
  }

  .feature-card {
    padding: 2rem;
  }
}
</style>
