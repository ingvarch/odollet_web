<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const APP_STORE_URL = 'https://apps.apple.com/app/id6751579293'

const COPYRIGHT_START_YEAR = 2025
const copyrightYears = computed(() => {
  const now = new Date().getFullYear()
  return now > COPYRIGHT_START_YEAR ? `${COPYRIGHT_START_YEAR}–${now}` : `${COPYRIGHT_START_YEAR}`
})
</script>

<template>
  <div class="privacy-page">
    <!-- Floating Instrument Cluster Navigation -->
    <header class="nav-shell">
      <nav class="nav-island" aria-label="Primary">
        <RouterLink to="/" class="nav-brand" aria-label="Odollet home">
          <img src="/images/AppIcon.jpg" alt="" class="brand-icon" aria-hidden="true" />
          <span class="brand-logo">Odollet</span>
          <span class="brand-spec tabular" aria-hidden="true">PRIVACY SPEC</span>
        </RouterLink>

        <div class="nav-actions">
          <RouterLink to="/" class="btn-back">
            <span aria-hidden="true">←</span>
            <span>Back to Cockpit</span>
          </RouterLink>
          <a :href="APP_STORE_URL" class="btn-island-sm" target="_blank" rel="noopener">
            <span>App Store</span>
          </a>
        </div>
      </nav>
    </header>

    <main id="main-content" class="policy-main">
      <div class="container">
        <!-- Header Block -->
        <div class="policy-hero">
          <div class="policy-meta tabular">
            <span>DOCUMENT // PRIVACY &amp; PERMISSIONS</span>
            <span>LAST UPDATED: APRIL 28, 2026</span>
          </div>
          <h1 class="policy-title">Privacy Policy</h1>
          <p class="policy-lead">
            Odollet (“Odometer Wallet”) is a focused logbook for motorcyclists — track mileage, expenses, fuel and maintenance, set service reminders, record GPS rides, and, if you choose, sync across your own Apple devices. This Privacy Policy explains what the app does and does not do with your data.
          </p>

          <!-- Quick Hardware Guarantees -->
          <dl class="guarantee-strip tabular">
            <div class="guarantee-box">
              <dt>SERVERS OPERATED</dt>
              <dd>0 Servers</dd>
            </div>
            <div class="guarantee-box">
              <dt>ANALYTICS &amp; TRACKERS</dt>
              <dd>0 SDKs</dd>
            </div>
            <div class="guarantee-box">
              <dt>ACCOUNT REQUIRED</dt>
              <dd>None</dd>
            </div>
            <div class="guarantee-box">
              <dt>DEFAULT STORAGE</dt>
              <dd>On-Device Sandbox</dd>
            </div>
          </dl>
        </div>

        <!-- Policy Sections in Double-Bezel Enclosure -->
        <div class="double-bezel">
          <div class="double-bezel-core policy-document">
            <section class="policy-section">
              <h2>1. Introduction</h2>
              <p>
                Odollet (“Odometer Wallet”) is a focused logbook for motorcyclists — track mileage, expenses, fuel and maintenance, set service reminders, record GPS rides, and, if you choose, sync across your own Apple devices. This Privacy Policy explains what the app does and does not do with your data.
              </p>
            </section>

            <section class="policy-section">
              <h2>2. What We Collect</h2>
              <ul>
                <li>We do <strong>not</strong> operate any server. The developer has no access to the data you enter.</li>
                <li>We do <strong>not</strong> use analytics, crash reporting, or tracking SDKs.</li>
                <li>We do <strong>not</strong> show advertising and we do <strong>not</strong> integrate with social networks.</li>
                <li>No account, email, or sign-in is required.</li>
                <li>The optional <strong>Supporter</strong> subscription is sold and billed by Apple through the App Store. The app only learns from Apple whether your subscription is active; it never sees your name, email, or payment details.</li>
              </ul>
            </section>

            <section class="policy-section">
              <h2>3. Where Your Data Lives</h2>
              <ul>
                <li>By default, all motorcycles, log entries, reminders, photos, attachments, GPS ride tracks and settings are stored locally on your device (iOS sandbox, encrypted at rest).</li>
                <li><strong>GPS rides</strong> you record stay on your device by default. Each ride keeps its compressed point track (route geometry, timestamps and speeds) inside the app’s sandbox. The GPS stream is never transmitted to any third-party server.</li>
                <li>When you enable <strong>iCloud Sync</strong> (Settings → iCloud Sync), the same data — including ride summaries and their compressed point tracks — is replicated through your own private CloudKit database so your other Apple devices can see it. This is end-to-end between you and Apple — we never see the data.</li>
                <li><strong>Calendar Sync</strong> (optional) writes date-based service reminders into your Apple Calendar via iOS’s EventKit. Events stay inside your calendar; the app does not read them back.</li>
                <li><strong>Recap videos</strong> are rendered on-device. When you choose to save one, it is written directly to your Photos library; the app does not retain a separate copy.</li>
              </ul>
            </section>

            <section class="policy-section">
              <h2>4. Permissions the App Asks For</h2>
              <ul>
                <li><strong>Location (When In Use)</strong> — only requested when you start a GPS ride. The app uses GPS to record the ride’s distance, speed and route. You can stop the ride at any time to end location use.</li>
                <li><strong>Location (Always / background)</strong> — only requested if you want a ride to keep recording while the screen is off or you switch apps. Used solely to continue the in-progress ride; no location is captured outside an active ride. iOS shows a blue status bar / pill while the app is using your location in the background.</li>
                <li><strong>Live Activities</strong> — while a ride is recording, an opt-in Lock Screen Live Activity shows distance, duration and current speed. The activity is local to your device and ends when you stop the ride.</li>
                <li><strong>Notifications</strong> — used to remind you about upcoming services, expiring insurance/registration, and (optional) gentle nudges if a routine activity (wash, oil, ride) hasn’t been logged in a while. Optional.</li>
                <li><strong>Photo Library (read)</strong> — only when you pick a hero photo or attach photos to a log entry. Only the images you explicitly pick leave the library.</li>
                <li><strong>Photo Library (add)</strong> — only when you save a ride recap video. The app writes the rendered video to Photos so you can watch and share it from your gallery; nothing else is added.</li>
                <li><strong>Camera</strong> — only used on demand by the built-in receipt scanner. No photo or video is captured in the background.</li>
                <li><strong>Calendar</strong> — only requested if you enable Calendar Sync for service reminders. Write-only, scoped to events the app creates.</li>
                <li><strong>iCloud (CloudKit)</strong> — only if you enable iCloud Sync. Uses your Apple ID’s private database. No public or shared CloudKit scopes.</li>
                <li><strong>Siri / Shortcuts</strong> — on-device intents that act on the active motorcycle; iOS decides what Siri learns from your usage, not the app.</li>
                <li><strong>Files</strong> — only when you import or export a backup.</li>
                <li>No contacts, microphone, HealthKit, or motion data is accessed. Location is only ever used while a ride is recording.</li>
              </ul>
            </section>

            <section class="policy-section">
              <h2>5. Backups You Export</h2>
              <ul>
                <li>The Import / Export screen creates a ZIP backup containing exactly the data you’ve entered: a JSON file with your records, ride metadata and the compressed point tracks of any rides you’ve recorded, plus your motorcycle photos and log entry attachments such as receipts.</li>
                <li>PDF exports (Service History, Motorcycle Profile) include only the fields from the matching motorcycle plus the hero photo if present.</li>
                <li>Ride share posters and recap videos you generate are produced on-device and shared only when you explicitly choose a destination.</li>
                <li>You pick the destination (Files, iCloud Drive, email, AirDrop…). Once exported, the file is governed by the destination’s privacy rules, not by Odollet.</li>
              </ul>
            </section>

            <section class="policy-section">
              <h2>6. Deleting Your Data</h2>
              <ul>
                <li>Uninstall the app to wipe every local record, photo, attachment and ride track on that device.</li>
                <li>Delete a single ride from its detail screen to remove its track and the paired log entry.</li>
                <li>Settings → iCloud Sync → <strong>Erase iCloud Data</strong> wipes the private CloudKit database for this app — including ride records — without touching local data.</li>
                <li>Calendar events the app created can be removed in the Calendar app; disabling Calendar Sync prevents new events from being added.</li>
              </ul>
            </section>

            <section class="policy-section">
              <h2>7. Third Parties</h2>
              <ul>
                <li>The only services the app talks to are Apple’s: Core Location (GPS), MapKit (map rendering), APNs (push delivery), ActivityKit (Live Activities), CloudKit (iCloud sync), EventKit (calendar), PhotoKit, AVFoundation (video rendering), Siri Intents, WeatherKit (the weather at a ride’s start point), StoreKit (the optional subscription and App Store rating requests).</li>
                <li>All of them are governed by Apple’s privacy policy and run within iOS’s permission system.</li>
                <li>No other third-party SDK, analytics service, or backend is integrated.</li>
              </ul>
            </section>

            <section class="policy-section">
              <h2>8. Your Rights</h2>
              <ul>
                <li>Full control: every cloud-facing feature (sync, reminders, calendar, notifications) is opt-in and reversible.</li>
                <li>Export or delete your data at any time through the app — no requests or accounts needed.</li>
                <li>Revoke individual permissions any time from iOS Settings → Privacy &amp; Security.</li>
              </ul>
            </section>

            <section class="policy-section">
              <h2>9. Updates &amp; Contact</h2>
              <ul>
                <li>Policy updates ship with new app versions via the App Store.</li>
                <li>Questions or concerns? Use the App Store support link or email <a href="mailto:info@odollet.com">info@odollet.com</a> to reach the developer.</li>
                <li>Effective date: the install or last update date of your current version.</li>
              </ul>
            </section>

            <div class="policy-bottom-cta">
              <RouterLink to="/" class="btn-redline">
                <span>Return to Odollet Overview</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="cockpit-footer">
      <div class="container footer-bottom tabular">
        <p>&copy; {{ copyrightYears }} Odollet. All rights reserved.</p>
        <RouterLink to="/" class="footer-home-link">odollet.com</RouterLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.privacy-page {
  min-height: 100dvh;
  background-color: var(--bg-obsidian);
  color: var(--ink-primary);
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
}

/* Floating Navigation */
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
  max-width: 920px;
  margin: 0 auto;
  padding: 0.5rem 0.65rem 0.5rem 0.85rem;
  border-radius: 999px;
  background: rgba(14, 18, 27, 0.82);
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
  color: var(--ink-primary);
}

.brand-spec {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--telemetry-green);
  background: var(--telemetry-green-dim);
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--hairline-strong);
  color: var(--ink-primary);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 180ms var(--ease-out), transform 160ms var(--ease-out);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-back:active {
  transform: scale(0.97);
}

.btn-island-sm {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: var(--redline);
  color: #090B10;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 160ms var(--ease-out), background-color 180ms var(--ease-out);
}

.btn-island-sm:hover {
  background: var(--redline-bright);
}

.btn-island-sm:active {
  transform: scale(0.97);
}

/* Main Content */
.policy-main {
  flex: 1;
  padding: 8.5rem 0 5rem;
}

.policy-hero {
  margin-bottom: 2.5rem;
}

.policy-meta {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--redline-bright);
  margin-bottom: 0.75rem;
}

.policy-title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 4.5vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.policy-lead {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--ink-secondary);
  margin-bottom: 2rem;
}

.guarantee-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.guarantee-box {
  padding: 0.9rem 1rem;
  border-radius: 14px;
  background: var(--bg-panel);
  border: 1px solid var(--hairline-strong);
  box-shadow: var(--inner-highlight);
}

.guarantee-box dt {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
  margin-bottom: 0.25rem;
}

.guarantee-box dd {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ink-primary);
}

.policy-document {
  padding: 2.75rem;
}

.policy-section {
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--hairline);
}

.policy-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.policy-section h2 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink-primary);
  margin-bottom: 0.9rem;
}

.policy-section p {
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--ink-secondary);
}

.policy-section ul {
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.policy-section li {
  font-size: 0.96rem;
  line-height: 1.65;
  color: var(--ink-secondary);
}

.policy-section strong {
  color: var(--ink-primary);
  font-weight: 600;
}

.policy-section a {
  color: var(--redline-bright);
  text-decoration: underline;
}

.policy-bottom-cta {
  padding-top: 2rem;
  border-top: 1px solid var(--hairline);
  display: flex;
  justify-content: center;
}

.btn-redline {
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  background: var(--redline);
  color: #090B10;
  font-weight: 700;
  font-size: 0.92rem;
  text-decoration: none;
  transition: transform 160ms var(--ease-out), background-color 180ms var(--ease-out);
}

.btn-redline:hover {
  background: var(--redline-bright);
}

.btn-redline:active {
  transform: scale(0.97);
}

.cockpit-footer {
  border-top: 1px solid var(--hairline);
  background: #06080C;
  padding: 2rem 0;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-muted);
}

.footer-home-link {
  color: var(--ink-secondary);
  text-decoration: none;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1.25rem;
  }

  .brand-spec {
    display: none;
  }

  .guarantee-strip {
    grid-template-columns: repeat(2, 1fr);
  }

  .policy-document {
    padding: 1.5rem;
  }
}
</style>
