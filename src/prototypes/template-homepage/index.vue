<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import ChromeWrapper from '@/components/ChromeWrapper.vue'
import Dashboard from '@/components/Dashboard.vue'
import DashboardModule from '@/components/DashboardModule.vue'
import SpecialPageWrapper from '@/components/SpecialPageWrapper.vue'
import { useConfig } from '@/composables/useConfig'
import { configUserPageTitle } from '@/lib/config'
import HelpModule from './HelpModule.vue'
import ImpactModule from './ImpactModule.vue'
import MentorModule from './MentorModule.vue'
import { APP_HOME, HELP_LINKS, IMPACT, IMPACT_DESKTOP, MENTOR, MODULE } from './dashpage-fixtures'

const { user } = useConfig()

const showLoggedInModules = computed(() => user.value !== 'logged-out')

const impactMobileProps = computed(() =>
  user.value === 'experienced' ? { to: APP_HOME, ...IMPACT } : { to: APP_HOME },
)

const impactDesktopProps = computed(() =>
  user.value === 'experienced' ? IMPACT_DESKTOP : {},
)

const pageTitle = computed(() => configUserPageTitle(user.value))

definePage({
  meta: {
    title: 'Template: Homepage',
    description: 'Template for prototyping the newcomer homepage.',
  },
})
</script>

<template>
  <ChromeWrapper :last-edited-notice="false">
    <SpecialPageWrapper :title="pageTitle" help>
      <div class="prototype-dashpage-shell">
        <Dashboard>
          <template #banner>
            <RouterLink :to="APP_HOME" class="dashboard-mobile-banner__feedback">
              Share feedback
            </RouterLink>
          </template>

          <template #mobile>
            <DashboardModule
              class="dashboard-slot--mobile-primary"
              :to="APP_HOME"
              :title="MODULE.thankTitle"
              cta="Open module"
            >
              <p class="prototype-dashpage-placeholder">{{ MODULE.thankBody }}</p>
            </DashboardModule>

            <ImpactModule v-if="showLoggedInModules" v-bind="impactMobileProps" />

            <MentorModule
              v-if="showLoggedInModules"
              :mentor-name="MENTOR.name"
              :edit-count="MENTOR.editCount"
              :last-active-days-ago="MENTOR.lastActiveDaysAgo"
              :mentor-note="MENTOR.note"
              :to="APP_HOME"
              :learn-more-href="MENTOR.learnMoreHref"
              :conversations-href="MENTOR.conversationsHref"
            />

            <DashboardModule :to="APP_HOME" :title="MODULE.policiesTitle" :cta="null">
              <p class="prototype-dashpage-placeholder">{{ MODULE.policiesBody }}</p>
            </DashboardModule>

            <HelpModule compact :to="APP_HOME" />
          </template>

          <template #primary>
            <DashboardModule :title="MODULE.thankTitle">
              <p class="prototype-dashpage-placeholder">{{ MODULE.thankBody }}</p>
            </DashboardModule>
          </template>

          <template #sidebar>
            <ImpactModule v-if="showLoggedInModules" v-bind="impactDesktopProps" />

            <MentorModule
              v-if="showLoggedInModules"
              :mentor-name="MENTOR.name"
              :edit-count="MENTOR.editCount"
              :last-active-days-ago="MENTOR.lastActiveDaysAgo"
              :mentor-note="MENTOR.note"
              :learn-more-href="MENTOR.learnMoreHref"
              :conversations-href="MENTOR.conversationsHref"
            />

            <DashboardModule
              class="dashboard-slot--desktop-secondary"
              :title="MODULE.policiesTitle"
            >
              <p class="prototype-dashpage-placeholder">{{ MODULE.policiesBody }}</p>
            </DashboardModule>

            <HelpModule :help-links="HELP_LINKS" view-more-href="#" />
          </template>
        </Dashboard>
      </div>
    </SpecialPageWrapper>
  </ChromeWrapper>
</template>

<style scoped>
.prototype-dashpage-shell {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
}

.prototype-dashpage-placeholder {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: var(--color-base--subtle, #54595d);
}

:deep(.dashboard-slot--mobile-primary .dashboard-module__body) {
  min-height: 3rem;
}

:deep(.dashboard-slot--desktop-primary .dashboard-module) {
  min-height: 8rem;
}
</style>
