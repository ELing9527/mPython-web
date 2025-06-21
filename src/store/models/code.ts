import { createModel } from '@rematch/core'
import type {RootModel} from './index'

interface codeState {
    doc: string | undefined
}

export const code = createModel<RootModel>()({
    state: {
        doc: 'hello,world!'
    } as codeState,
    reducers: {
       setDoc(state,doc: string | undefined){
            return { state, doc }
       }
    },
})
