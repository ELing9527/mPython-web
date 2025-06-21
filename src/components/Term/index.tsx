import React, { useRef, useEffect } from 'react';
import '@xterm/xterm/css/xterm.css'
import './term.css'
import styles from "./index.module.css"
import {useSelector,useDispatch} from "react-redux";
import type {RootState} from "@/store";
import {Minus} from "lucide-react";
import {useTranslation} from 'react-i18next';
import {Resizable} from "re-resizable";

const Term: React.FC = () => {
    const termRef = useRef(null);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {termShow,fitAddon} = useSelector((state: RootState) => state.terminal)

    useEffect(() => {
        if(termShow){
            dispatch.terminal.onOpenTerminal(termRef.current)
        }
        return ()=>{
            dispatch.terminal.onDisTerminal()
        }
    }, [termShow]);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            // console.log(entries)
            fitAddon?.fit()

            for (const entry of entries) {
                console.log('元素新尺寸:', entry.contentRect.width, entry.contentRect.height);
                console.log(fitAddon)
            }
        });
        const termNode = termRef.current;
        if(termNode) observer.observe(termNode);
        return () => {
            if(termNode) observer.unobserve(termNode);
        }
    }, [fitAddon]);


    return (termShow &&
        <>
            <Resizable
                defaultSize={{
                    width: '100%',
                    height: '230px',
                }}
                maxHeight="80vh"
                minHeight="230px"
                maxWidth="100%"
                minWidth="100%"
                enable={{
                    top: termShow,
                    right: false,
                    bottom: false,
                    left: false,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false,
                }}>
                <div className={styles.termLine}>
                    <div>{t('term')}</div>
                    <Minus className={styles.icon} onClick={() => dispatch.terminal.setTermShow(!termShow)}/>
                </div>
                <div className={styles.term} ref={termRef}></div>
            </Resizable>

        </>
        )
};

export default Term;


