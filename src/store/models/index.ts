import type {Models} from '@rematch/core'
import { code } from './code'
import { esp } from './esp'
import {terminal} from './terminal'
import {pythonCode} from "./pythonCode";

export interface RootModel extends Models<RootModel> {
    code: typeof code,
    esp: typeof esp,
    terminal: typeof terminal,
    pythonCode:typeof pythonCode,
}

export const models: RootModel = { code, esp, terminal, pythonCode }
