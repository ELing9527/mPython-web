import {createModel} from '@rematch/core'
import type {RootModel} from './index'

interface PythonFileNode {
    pid: string
    id: string | number
    name: string
    doc: string
    children?: PythonFileNode[]
}

interface pythonFileEditNode {
    id: string | number
    name: string
}

interface pythonCodeState {
    pythonFileTree:PythonFileNode[] | []
    pythonFileEdit: pythonFileEditNode[] | []
    currentPythonId: number | string | null
}

export const pythonCode = createModel<RootModel>()({
    state: {
        pythonFileTree: [],
        pythonFileEdit: [],
        currentPythonId: null
    } as pythonCodeState,
    reducers: {
        getPythonFileTree(state,pythonFileTree:PythonFileNode[]|[]){
            return {...state,pythonFileTree}
        },

    },
    effects: (dispatch) => {
        return {
            async onGetPythonFileTree(){
              // 请求拿到数据
                const arr:{ pid: string; id: string; name: string; doc: string }[] = [{
                    pid:'0',
                    id:'0-1',
                    name:'main.py',
                    doc:'mPython!!!!!!!!!!!!!!!!!!'
                }]
                dispatch.pythonCode.getPythonFileTree(arr)
            }
        }
    }
})
