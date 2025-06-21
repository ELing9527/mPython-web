import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './i18n';
import { Provider } from 'react-redux'
import { store } from '@/store'
import { BrowserRouter, Routes, Route  } from "react-router";
import MicroPythonCode from "@/page/MicroPythonCode";
import PythonCode from "@/page/PythonCode"

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="mPython" element={<MicroPythonCode/>}></Route>
                    <Route path="python" element={<PythonCode/>}></Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)
