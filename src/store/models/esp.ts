import {createModel} from '@rematch/core'
import type {RootModel} from './index'
import {serial, SerialPort} from 'web-serial-polyfill'
import {ESPLoader, type FlashOptions, type LoaderOptions, Transport} from "esptool-js";
import CryptoJS from 'crypto-js'

export interface addressBin {
    address: number
    data: string
}

export interface espState {
    baudRate: number
    port: SerialPort | null
}

export const esp = createModel<RootModel>()({
    state: {
        baudRate: 115200,
        port: null,
    } as espState,
    reducers: {
        setBaudRate(state, baudRate: number) {
            return {...state, baudRate}
        },
        setPort(state, port: SerialPort | null) {
            return {...state, port}
        },
    },
    effects: (dispatch) => {


        let textEncoder: TextEncoderStream | null = null
        let textDecoder: TextDecoderStream | null = null

        let writer: WritableStreamDefaultWriter<string> | null = null
        let reader: ReadableStreamDefaultReader<string> | null = null


        let encoderWritableStreamClosed: Promise<void> | null = null
        let decoderReadableStreamClosed: Promise<void> | null = null



        const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
        const wr = async (port: SerialPort) => {
            console.log('进入')
            await port.setSignals({dataTerminalReady: true, requestToSend: false})
            await delay(100)
            await port.setSignals({dataTerminalReady: false, requestToSend: true})
            await delay(100)

            textEncoder = new TextEncoderStream()
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            encoderWritableStreamClosed = textEncoder.readable.pipeTo(port.writable)
            writer = textEncoder.writable.getWriter()
            console.log(writer)

            textDecoder = new TextDecoderStream()
            decoderReadableStreamClosed = port.readable!.pipeTo(textDecoder.writable)
            reader = textDecoder.readable.getReader()
            const readLoop = async () => {
                try {
                    while (true) {
                        const { value, done } = await reader!.read()
                        if (done) break
                        if (value) dispatch.terminal.onLogWriter(value)
                    }
                } catch (err) {
                    console.warn('读取中断:', err)
                }
            }
            readLoop()
        }
        const dis = async () => {
            try {
                if (reader) {
                    await reader.cancel().catch(() => {})
                    reader.releaseLock()
                    reader = null
                }

                if (textDecoder) {
                    await decoderReadableStreamClosed?.catch(() => {})
                    textDecoder = null
                }

                if (writer) {
                    await writer.close().catch(() => {})
                    writer.releaseLock()
                    writer = null
                }

                if (textEncoder) {
                    await encoderWritableStreamClosed?.catch(() => {})
                    textEncoder = null
                }
            } catch (e) {
                console.warn('释放失败', e)
            }
        }

        return {
            async onConnect(_payload, state) {
                try {
                    if (!state.terminal.termShow) {
                        dispatch.terminal.setTermShow(true)
                    }
                    if (state.esp.port) {
                        dispatch.terminal.onLogWriter('串行端口已连接！')
                        console.log('串行端口已连接！')
                        return
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    const port = await (navigator?.serial || serial).requestPort()
                    await port.open({baudRate: state.esp.baudRate})
                    dispatch.terminal.onLogWriter('串行端口连接成功！')
                    console.log('串行端口连接成功！')
                    dispatch.esp.setPort(port)
                    await wr(port)

                } catch (e) {
                    console.error(e)
                    if (e instanceof Error && e.name === 'NetworkError') {
                        await dis()
                        await state.esp.port?.close()
                        dispatch.esp.setPort(null)
                        dispatch.terminal.onLogWriter('串行端口连接=======NetworkError！')
                        console.log('串行端口连接=======NetworkError！')
                    }
                    console.log('串行端口连接失败！')
                }
            },
            async onInitBin(_payload: addressBin[], state) {
                try {
                    if (!state.esp.port) {
                        console.log('串行端口未连接！')
                        console.log('请先连接串行端口！')
                        dispatch.terminal.onLogWriter('串行端口未连接or请先连接串行端口！')
                        return
                    }

                    await dis()
                    await state.esp.port.close()

                    const transport = new Transport(state.esp.port, true)
                    const esploader = new ESPLoader({
                        transport,
                        baudrate: state.esp.baudRate,
                        terminal: {
                            clean() {
                                state.terminal.xterm?.clear()
                            },
                            writeLine(data) {
                                state.terminal.xterm?.writeln(data)
                            },
                            write(data) {
                                state.terminal.xterm?.write(data)
                            },
                        },
                    } as LoaderOptions)

                    await esploader.main()

                    const flashOptions: FlashOptions = {
                        fileArray: _payload,
                        flashSize: 'keep',
                        eraseAll: false,
                        compress: true,
                        reportProgress: (_fileIndex, written, total) => {
                            const percent = (written / total) * 100
                            console.log(percent)
                        },
                        calculateMD5Hash: (image) =>
                            CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)).toString(),
                    } as FlashOptions

                    await esploader.writeFlash(flashOptions)
                    await esploader.after()

                    dispatch.terminal.onLogWriter('初始化固件成功！')
                    console.log('初始化固件成功！')

                    await transport.disconnect()
                    await state.esp.port.open({baudRate: state.esp.baudRate})
                    await wr(state.esp.port)
                } catch (e) {
                    console.error(e)
                    dispatch.terminal.onLogWriter(`固件初始化失败:${e}`)
                    console.log('固件初始化失败！')
                }
            },
            async onWriteManiPy({script, flash = true}: { script: string; flash?: boolean }) {
                console.log(script, flash)
                try {
                    if (!writer) {
                        console.log('没有写入能力！')
                        console.log('串行端口未连接或固件烧录中！')
                        dispatch.terminal.onLogWriter(`没有写入能力or串行端口未连接或固件烧录中!`)
                        return
                    }

                    const enterRaw = async () => {
                        await writer?.write('\x03')
                        await delay(100)
                        await writer?.write('\x01')
                        await delay(100)
                    }

                    const sendCode = async (code: string) => {
                        const lines = code.split('\n')
                        for (const line of lines) {
                            await writer?.write(`${line}\r`)
                            await delay(5)
                        }
                    }

                    const exitRaw = async () => {
                        await writer?.write('\x02')
                        await delay(100)
                    }

                    const restart = async () => {
                        await enterRaw()
                        await sendCode('import machine')
                        await sendCode('machine.reset()')
                        await writer?.write('\x04')
                        await delay(200)
                        await exitRaw()
                    }

                    if (flash) {
                        await writer?.write(`${script}\r\n`)
                    } else {
                        await enterRaw()
                        await sendCode('with open("/main.py", "w") as f:')
                        const lines = script.split('\n')
                        for (const line of lines) {
                            const escaped = line.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
                            await sendCode(`    f.write('${escaped}\\n')`)
                        }
                        await writer!.write('\x04')
                        await delay(200)
                        await exitRaw()
                        await restart()
                        console.log('程序写入成功!')
                        dispatch.terminal.onLogWriter(`程序写入成功!`)
                    }
                } catch (e) {
                    console.error(e)
                    dispatch.terminal.onLogWriter(`程序写入错误:${e}`)
                    console.log('程序写入错误!')
                }
            },
            async onDis(_payload, state) {
                try {
                    if (!state.esp.port) {
                        console.log('串行端口未连接!')
                        dispatch.terminal.onLogWriter(`串行端口未连接!`)
                        return
                    }
                    await dis()
                    await state.esp.port.close()
                    dispatch.esp.setPort(null)
                    dispatch.terminal.onLogWriter(`串行端口已断开!`)
                    console.log('串行端口已断开!')
                } catch (e) {
                    console.error(e)
                    dispatch.terminal.onLogWriter(`串行端口断开失败:${e}`)
                    console.log('串行端口断开失败')
                }
            },
        }
    },
})
