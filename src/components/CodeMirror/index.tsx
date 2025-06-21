import React, {useRef, useEffect} from 'react';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { python } from "@codemirror/lang-python"
import { json } from "@codemirror/lang-json"
import styles from "./index.module.css"
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";

interface CodeMirrorProps {
    style?: React.CSSProperties; // 支持传入 style
}
const CodeMirror: React.FC<CodeMirrorProps> = ({ style }) => {
    const editorRef = useRef(null);
    const {doc} = useSelector((state: RootState) => state.code);
    const dispatch = useDispatch();
    useEffect(() => {
        const container = editorRef.current;
        if (!container) return;

        // 初始化CodeMirror编辑器
        const state = EditorState.create({
            doc,
            extensions: [
                basicSetup,
                python(),
                json(),
                // ayuLight,
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        // setDock(v.state.doc.toString());
                        dispatch.code.setDoc(v.state.doc.toString())
                    }
                }),
            ],
        });
        const editor = new EditorView({
            state,
            parent: container,
        });

        return () => {
            editor.destroy(); // 注意：此后此处要随组件销毁
        };
    }, []);
    return <div className={styles.codeMirror} style={style} ref={editorRef}></div>;
};

export default CodeMirror;


