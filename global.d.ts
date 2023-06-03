declare module 'virtual:pwa-register/solid' {
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-expect-error ignore when solid-js is not installed
  import type { Accessor, Setter } from 'solid-js'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [Accessor<boolean>, Setter<boolean>]
    offlineReady: [Accessor<boolean>, Setter<boolean>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
