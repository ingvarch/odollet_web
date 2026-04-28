<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="privacy-policy">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-container">
        <RouterLink to="/" class="nav-brand" aria-label="Odollet home">
          <img src="/images/AppIcon.jpg" alt="" class="brand-icon" aria-hidden="true" />
          <span class="brand-logo">Odollet</span>
        </RouterLink>
        <div class="nav-links">
          <RouterLink to="/">Home</RouterLink>
        </div>
      </div>
    </nav>

    <!-- Privacy Policy Content -->
    <div class="policy-container">
      <div class="policy-content">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last updated: April 28, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Odollet ("Odometer Wallet") is a focused logbook for motorcyclists - track mileage, expenses, fuel and maintenance, set service reminders, record GPS rides, and, if you choose, sync across your own Apple devices. This Privacy Policy explains what the app does and does not do with your data.
          </p>
        </section>

        <section>
          <h2>2. What We Collect</h2>
          <ul>
            <li>We do <strong>not</strong> operate any server. The developer has no access to the data you enter.</li>
            <li>We do <strong>not</strong> use analytics, crash reporting, or tracking SDKs.</li>
            <li>We do <strong>not</strong> show advertising and we do <strong>not</strong> integrate with social networks.</li>
            <li>No account, email, or sign-in is required.</li>
          </ul>
        </section>

        <section>
          <h2>3. Where Your Data Lives</h2>
          <ul>
            <li>By default, all motorcycles, log entries, reminders, photos, attachments, GPS ride tracks and settings are stored locally on your device (iOS sandbox, encrypted at rest).</li>
            <li><strong>GPS rides</strong> you record stay on your device by default. Each ride keeps its compressed point track (route geometry, timestamps and speeds) inside the app's sandbox. The GPS stream is never transmitted to any third-party server.</li>
            <li>When you enable <strong>iCloud Sync</strong> (Settings → iCloud Sync), the same data - including ride summaries and their compressed point tracks - is replicated through your own private CloudKit database so your other Apple devices can see it. This is end-to-end between you and Apple - we never see the data.</li>
            <li><strong>Calendar Sync</strong> (optional) writes date-based service reminders into your Apple Calendar via iOS's EventKit. Events stay inside your calendar; the app does not read them back.</li>
            <li><strong>Recap videos</strong> are rendered on-device. When you choose to save one, it is written directly to your Photos library; the app does not retain a separate copy.</li>
          </ul>
        </section>

        <section>
          <h2>4. Permissions the App Asks For</h2>
          <ul>
            <li><strong>Location (When In Use)</strong> - only requested when you start a GPS ride. The app uses GPS to record the ride's distance, speed and route. You can stop the ride at any time to end location use.</li>
            <li><strong>Location (Always / background)</strong> - only requested if you want a ride to keep recording while the screen is off or you switch apps. Used solely to continue the in-progress ride; no location is captured outside an active ride. iOS shows a blue status bar / pill while the app is using your location in the background.</li>
            <li><strong>Live Activities</strong> - while a ride is recording, an opt-in Lock Screen Live Activity shows distance, duration and current speed. The activity is local to your device and ends when you stop the ride.</li>
            <li><strong>Notifications</strong> - used to remind you about upcoming services, expiring insurance/registration, and (optional) gentle nudges if a routine activity (wash, oil, ride) hasn't been logged in a while. Optional.</li>
            <li><strong>Photo Library (read)</strong> - only when you pick a hero photo or attach photos to a log entry. Only the images you explicitly pick leave the library.</li>
            <li><strong>Photo Library (add)</strong> - only when you save a ride recap video. The app writes the rendered video to Photos so you can watch and share it from your gallery; nothing else is added.</li>
            <li><strong>Camera</strong> - only used on demand by the built-in receipt scanner. No photo or video is captured in the background.</li>
            <li><strong>Calendar</strong> - only requested if you enable Calendar Sync for service reminders. Write-only, scoped to events the app creates.</li>
            <li><strong>iCloud (CloudKit)</strong> - only if you enable iCloud Sync. Uses your Apple ID's private database. No public or shared CloudKit scopes.</li>
            <li><strong>Siri / Shortcuts</strong> - on-device intents that act on the active motorcycle; iOS decides what Siri learns from your usage, not the app.</li>
            <li><strong>Files</strong> - only when you import or export a backup.</li>
            <li>No contacts, microphone, HealthKit, or motion data is accessed. Location is only ever used while a ride is recording.</li>
          </ul>
        </section>

        <section>
          <h2>5. Backups You Export</h2>
          <ul>
            <li>The Import / Export screen creates a JSON backup containing exactly the data you've entered, including ride metadata and the compressed point tracks of any rides you've recorded.</li>
            <li>PDF exports (Service History, Motorcycle Profile) include only the fields from the matching motorcycle plus the hero photo if present.</li>
            <li>Ride share posters and recap videos you generate are produced on-device and shared only when you explicitly choose a destination.</li>
            <li>You pick the destination (Files, iCloud Drive, email, AirDrop…). Once exported, the file is governed by the destination's privacy rules, not by Odollet.</li>
          </ul>
        </section>

        <section>
          <h2>6. Deleting Your Data</h2>
          <ul>
            <li>Uninstall the app to wipe every local record, photo, attachment and ride track on that device.</li>
            <li>Delete a single ride from its detail screen to remove its track and the paired log entry.</li>
            <li>Settings → iCloud Sync → <strong>Erase iCloud Data</strong> wipes the private CloudKit database for this app - including ride records - without touching local data.</li>
            <li>Calendar events the app created can be removed in the Calendar app; disabling Calendar Sync prevents new events from being added.</li>
          </ul>
        </section>

        <section>
          <h2>7. Third Parties</h2>
          <ul>
            <li>The only services the app talks to are Apple's: Core Location (GPS), MapKit (map rendering), APNs (push delivery), ActivityKit (Live Activities), CloudKit (iCloud sync), EventKit (calendar), PhotoKit, AVFoundation (video rendering), Siri Intents.</li>
            <li>All of them are governed by Apple's privacy policy and run within iOS's permission system.</li>
            <li>No other third-party SDK, analytics service, or backend is integrated.</li>
          </ul>
        </section>

        <section>
          <h2>8. Your Rights</h2>
          <ul>
            <li>Full control: every cloud-facing feature (sync, reminders, calendar, notifications) is opt-in and reversible.</li>
            <li>Export or delete your data at any time through the app - no requests or accounts needed.</li>
            <li>Revoke individual permissions any time from iOS Settings → Privacy &amp; Security.</li>
          </ul>
        </section>

        <section>
          <h2>9. Updates &amp; Contact</h2>
          <ul>
            <li>Policy updates ship with new app versions via the App Store.</li>
            <li>Questions or concerns? Use the App Store support link to reach the developer.</li>
            <li>Effective date: the install or last update date of your current version.</li>
          </ul>
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
  font-family: var(--font-sans);
  line-height: 1.6;
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
