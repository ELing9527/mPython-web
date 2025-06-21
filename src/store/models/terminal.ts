import { createModel } from '@rematch/core'
import type {RootModel} from './index'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'


export interface terminalState {
    termShow: boolean
    xterm: Terminal | null
    fitAddon: FitAddon | null
    inputBuffer: string
}

export const terminal = createModel<RootModel>()({
    state:{
        termShow: false,
        xterm: null,
        fitAddon: null,
        inputBuffer: '',
    } as terminalState,
    reducers: {
        setTermShow(state,termShow: boolean){
            return { ...state, termShow }
        },
        setXterm(state, xterm: Terminal | null) {
            return { ...state, xterm }
        },
        setFitAddon(state, addon: FitAddon | null) {
            return { ...state, fitAddon: addon }
        },
        setInputBuffer(state, buffer: string) {
            return { ...state, inputBuffer: buffer }
        },
    },
    effects: (dispatch) => {
        return {
            onOpenTerminal(dom: HTMLElement,state) {
                const terminal = new Terminal({
                    cursorBlink: true,
                    fontSize: 14,
                    theme: { background: '#1e1e1e'},
                })
                const addon = new FitAddon()
                terminal.loadAddon(addon)
                terminal.open(dom)
                addon.fit()
                terminal.write('\r\n>>> ')
                terminal.onData((data) => {
                    const printable = data.match(/[\x20-\x7E]/)
                    if (data === '\r') {
                        dispatch.esp.onWriteManiPy({ script: state.terminal.inputBuffer, flash: false })
                        dispatch.terminal.setInputBuffer('')
                        terminal.write('\r\n>>> ')
                    } else if (data === '\x7F' || data === '\x08') {
                        if (state.terminal.inputBuffer.length > 0) {
                            dispatch.terminal.setInputBuffer(state.terminal.inputBuffer.slice(0, -1))
                            terminal.write('\b \b')
                        }
                    } else if (printable) {
                        dispatch.terminal.setInputBuffer(state.terminal.inputBuffer + data)
                        terminal.write(data)
                    }
                })
                dispatch.terminal.setXterm(terminal)
                console.log(addon)
                dispatch.terminal.setFitAddon(addon)

            },
            onDisTerminal(_,state) {
                state.terminal.xterm?.dispose()
                dispatch.terminal.setXterm(null)
                dispatch.terminal.setFitAddon(null)
            },
            onLogWriter(_payload,state){
                state.terminal.xterm?.writeln(_payload)
            }
        }
    },
})
