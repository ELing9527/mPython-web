import Control from '@/components/Control'
import Codemirror from '@/components/CodeMirror';
import Term from "@/components/Term";
import styles from './index.module.css'
import {useEffect} from "react";
import {useDispatch} from "react-redux";





export default function MicroPythonCode() {
    const dispatch = useDispatch();

    useEffect(() => {
        // 定义命名函数作为事件处理程序
        const handleSerialDisconnect = async () => {
            await dispatch.esp.onDis();

        };

        // 添加监听器
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigator?.serial.addEventListener('disconnect', handleSerialDisconnect);

        // 返回清理函数，正确移除监听器
        return () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            navigator?.serial.removeEventListener('disconnect', handleSerialDisconnect);
        };
    }, []);

    useEffect(() => {
        dispatch.pythonCode.onGetPythonFileTree()
    }, []);

    return (
        <>
            <div className={styles.mPython}>
                <Control/>
                <div className={styles.r}>
                    <Codemirror/>
                    <Term/>
                </div>
            </div>
        </>

    )
}

