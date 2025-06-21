import { init } from '@rematch/core'
import { models } from './models'

export const store = init({ models })

export type RootState = ReturnType<typeof store.getState>
