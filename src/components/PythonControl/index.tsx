import styles from './index.module.css'
import {Folder, Settings, SquareTerminal} from "lucide-react";
import {Tooltip} from "antd";
import {useTranslation} from "react-i18next";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";

type ControlItem = {
    key: string;          // 唯一标识符
    icon: React.ReactNode; // 图标组件
    tooltip: string;      // 提示文字
};

export default function PythonControl(){
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {termShow} = useSelector((state: RootState) => state.terminal);
    const controlItems: ControlItem[] = [
        {
            key: 'term',
            icon: <SquareTerminal className={styles.icon} onClick={() => dispatch.terminal.setTermShow(!termShow)}/>,
            tooltip: t('term'),
        },
        {
            key: 'set',
            icon: <Settings className={styles.icon} />,
            tooltip: t('set'),
        }
    ];
    return (
        <div className={styles.pythonControl}>
            <Tooltip title={t('folder')} placement="right" color="#0769a1">
                <Folder  className={styles.icon}/>
            </Tooltip>
            <div className={styles.b}>
                {controlItems.map((item) => (
                    <Tooltip key={item.key} title={item.tooltip} placement="right" color="#0769a1">
                        {item.icon}
                    </Tooltip>
                ))}
            </div>
        </div>
    )
}