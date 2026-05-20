import { computed, readonly, ref, watch, type DeepReadonly, type Ref } from 'vue'

import {
  loadConfig,
  saveConfig,
  type Config,
  type ConfigTheme,
  type ConfigUser,
} from '@/lib/config'

const config = ref<Config>(loadConfig())

watch(
  config,
  (value) => {
    saveConfig(value)
  },
  { deep: true },
)

export function useConfig(): {
  config: DeepReadonly<Ref<Config>>
  theme: Ref<ConfigTheme>
  user: Ref<ConfigUser>
} {
  const theme = computed({
    get: () => config.value.theme,
    set: (value: ConfigTheme) => {
      config.value = { ...config.value, theme: value }
    },
  })

  const user = computed({
    get: () => config.value.user,
    set: (value: ConfigUser) => {
      config.value = { ...config.value, user: value }
    },
  })

  return {
    config: readonly(config),
    theme,
    user,
  }
}
