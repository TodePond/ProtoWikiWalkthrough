<script setup lang="ts">
definePage({
  meta: {
    title: 'ProtoWiki',
    description: 'Prototype index',
  },
})

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { CdxButton, CdxCard, CdxIcon, CdxPopover, CdxSelect } from '@wikimedia/codex'
import { cdxIconSettings } from '@wikimedia/codex-icons'

import PlainWrapper from '@/components/PlainWrapper.vue'
import { useConfig } from '@/composables/useConfig'
import { CONFIG_USER_MENU_ITEMS } from '@/lib/config'

const router = useRouter()
const { user } = useConfig()

interface PrototypeMeta {
  title?: string
  description?: string
}

interface PrototypeEntry {
  path: string
  title: string
  description?: string
  bucket: 'regular' | 'template' | 'example'
}

function humanize(path: string): string {
  return path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Top-level prototype only (src/prototypes/name/index.vue), not nested subfolder indexes. */
function isTopLevelPrototypePath(path: string): boolean {
  const segments = path.replace(/^\/|\/$/g, '').split('/').filter(Boolean)
  return segments.length === 1
}

/** Bucket from `definePage` title — `Template:` / `Example:` prefixes (case-insensitive). */
function prototypeBucket(title: string): 'regular' | 'template' | 'example' {
  const t = title.trim()
  if (/^template\s*:/i.test(t)) return 'template'
  if (/^example\s*:/i.test(t)) return 'example'
  return 'regular'
}

const bucketOrder: Record<'regular' | 'template' | 'example', number> = {
  regular: 0,
  template: 1,
  example: 2,
}

const prototypes = computed<PrototypeEntry[]>(() => {
  return router
    .getRoutes()
    .filter((route) => route.path !== '/' && route.path !== '/:catchAll(.*)')
    .filter((route) => isTopLevelPrototypePath(route.path))
    .map((route) => {
      const meta = (route.meta ?? {}) as PrototypeMeta
      const description =
        typeof meta.description === 'string' && meta.description.length > 0
          ? meta.description
          : undefined
      const title = meta.title ?? humanize(route.path)
      return {
        path: route.path,
        title,
        description,
        bucket: prototypeBucket(title),
      }
    })
    .sort((a, b) => {
      const ba = a.bucket
      const bb = b.bucket
      const cmpBucket = bucketOrder[ba] - bucketOrder[bb]
      if (cmpBucket !== 0) return cmpBucket
      return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    })
})

const regularPrototypes = computed(() => prototypes.value.filter((e) => e.bucket === 'regular'))

const templateAndExamplePrototypes = computed(() =>
  prototypes.value.filter((e) => e.bucket !== 'regular'),
)

const showBucketDivider = computed(
  () => regularPrototypes.value.length > 0 && templateAndExamplePrototypes.value.length > 0,
)

const settingsOpen = ref(false)
const settingsAnchor = ref<HTMLElement | null>(null)

</script>

<template>
  <!--  -->
  <PlainWrapper heading="ProtoWiki">
    <template #actions>
      <span ref="settingsAnchor">
        <CdxButton
          weight="quiet"
          :icon-only="true"
          aria-label="Settings"
          :aria-expanded="settingsOpen"
          @click="settingsOpen = !settingsOpen"
        >
          <CdxIcon :icon="cdxIconSettings" />
        </CdxButton>
      </span>
      <CdxPopover
        v-model:open="settingsOpen"
        :anchor="settingsAnchor"
        placement="bottom-end"
        render-in-place
        class="prototype-index__settings-popover"
      >
        <div class="prototype-index__settings-panel" @click.stop>
          <label class="prototype-index__settings-field">
            <span class="prototype-index__settings-label">User</span>
            <CdxSelect
              v-model:selected="user"
              :menu-items="CONFIG_USER_MENU_ITEMS"
              default-label="New editor"
            />
          </label>
        </div>
      </CdxPopover>
    </template>
    <div class="prototype-index">
      <div class="prototype-index__list">
        <div v-for="entry in regularPrototypes" :key="entry.path" class="prototype-index__card">
          <CdxCard :url="router.resolve({ path: entry.path }).href">
            <template #title>{{ entry.title }}</template>
            <template v-if="entry.description" #description>{{ entry.description }}</template>
          </CdxCard>
        </div>

        <hr v-if="showBucketDivider" class="prototype-index__divider" />

        <div
          v-for="entry in templateAndExamplePrototypes"
          :key="entry.path"
          class="prototype-index__card"
        >
          <CdxCard :url="router.resolve({ path: entry.path }).href">
            <template #title>{{ entry.title }}</template>
            <template v-if="entry.description" #description>{{ entry.description }}</template>
          </CdxCard>
        </div>
      </div>
    </div>
  </PlainWrapper>
</template>

<style scoped>
.prototype-index__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-75);
}

.prototype-index__card {
  min-width: 0;
}

.prototype-index__divider {
  margin: var(--spacing-50) 0;
  border: 0;
  border-top: 1px solid var(--border-color-subtle);
}

.prototype-index__settings-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-100);
  min-width: 12rem;
}

.prototype-index__settings-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-25);
}

.prototype-index__settings-label {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-subtle);
}
</style>

<!-- Popover is teleported; allow the select menu to extend past the scrollable body. -->
<style>
.prototype-index__settings-popover .cdx-popover__body {
  overflow: visible;
}
</style>
