<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="privacy-policy">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-container">
        <div class="nav-brand">
          <RouterLink to="/">
            <h2>Odollet</h2>
          </RouterLink>
        </div>
        <div class="nav-links">
          <RouterLink to="/">Home</RouterLink>
        </div>
      </div>
    </nav>

    <!-- Privacy Policy Content -->
    <div class="policy-container">
      <div class="policy-content">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last updated: August 27, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Odollet ("Odometer Wallet") is a smart, easy-to-use journal for motorcyclists who value order, clarity, and more time on the road. This Privacy Policy explains how we collect, use, and protect your information when you use our app.
          </p>
        </section>

        <section>
          <h2>2. No Data Collection</h2>
          <p><strong>We DO NOT collect any personal data.</strong></p>
          <p><strong>We DO NOT track your usage or behavior.</strong></p>
          <p><strong>We DO NOT send any data to external servers.</strong></p>
          <p><strong>We DO NOT use analytics or crash reporting services.</strong></p>
          <p><strong>We DO NOT access your location, contacts, or other personal information.</strong></p>
        </section>

        <section>
          <h2>3. Local Data Storage</h2>
          <p><strong>All your motorcycle data is stored locally on your device.</strong></p>
          <p>Ride logs, expenses, and maintenance records stay on your iPhone/iPad.</p>
          <p>Your motorcycles, custom log types, and settings are saved locally.</p>
          <p>No data is synchronized with cloud services without your explicit action.</p>
        </section>

        <section>
          <h2>4. Data Export & Backup</h2>
          <p>You control when to export your data via the backup feature.</p>
          <p>Exported files contain only the data you've entered.</p>
          <p>You choose where to store backup files (Files, iCloud, etc.).</p>
          <p>No automatic backups or data sharing occurs.</p>
          <p>Imports fully replace existing data, ensuring a clean, consistent log.</p>
        </section>

        <section>
          <h2>5. App Permissions</h2>
          <p>Push notifications: Only for monthly/yearly reminders (optional).</p>
          <p>Files access: Only when you import/export backup files.</p>
          <p>No access to camera, microphone, location, or contacts.</p>
          <p>All permissions can be managed in iOS Settings.</p>
        </section>

        <section>
          <h2>6. Data Security</h2>
          <p>Your data is protected by iOS security features.</p>
          <p>App data is sandboxed and encrypted at rest.</p>
          <p>Only you can access your motorcycle records.</p>
          <p>Deleting the app removes all stored data.</p>
        </section>

        <section>
          <h2>7. Third-Party Services</h2>
          <p><strong>We DO NOT use third-party analytics services.</strong></p>
          <p><strong>We DO NOT integrate with social media platforms.</strong></p>
          <p><strong>We DO NOT use advertising networks.</strong></p>
          <p><strong>No data is shared with external companies.</strong></p>
        </section>

        <section>
          <h2>8. Your Rights</h2>
          <p>Complete control over your data.</p>
          <p>Export your data anytime via backup feature.</p>
          <p>Delete all data by removing the app.</p>
          <p>No account registration or personal information required.</p>
        </section>

        <section>
          <h2>9. Policy Updates</h2>
          <p>Privacy policy updates will be communicated via App Store updates.</p>
          <p>For privacy-related questions, contact us through the App Store.</p>
          <p>This policy is effective as of the app installation date.</p>
          <p>We are committed to maintaining your privacy and data security.</p>
        </section>

        <div class="back-to-home">
          <RouterLink to="/" class="btn-primary">Back to Home</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-policy {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #2d3748;
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
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand a {
  text-decoration: none;
}

.nav-brand h2 {
  margin: 0;
  color: #1a365d;
  font-weight: 700;
  font-size: 1.5rem;
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

/* Policy Content */
.policy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 8rem 2rem 4rem;
}

.policy-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
}

.last-updated {
  color: #718096;
  font-style: italic;
  margin-bottom: 3rem;
}

.policy-content section {
  margin-bottom: 2.5rem;
}

.policy-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a365d;
  margin-bottom: 1rem;
  margin-top: 2rem;
}

.policy-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
}

.policy-content p {
  margin-bottom: 1rem;
}

.policy-content ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.policy-content li {
  margin-bottom: 0.5rem;
}

.policy-content a {
  color: #667eea;
  text-decoration: none;
}

.policy-content a:hover {
  text-decoration: underline;
}

.back-to-home {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.btn-primary {
  background: #667eea;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .policy-container {
    padding: 6rem 1rem 3rem;
  }

  .policy-content h1 {
    font-size: 2rem;
  }

  .policy-content h2 {
    font-size: 1.25rem;
  }

  .policy-content h3 {
    font-size: 1.1rem;
  }
}
</style>
