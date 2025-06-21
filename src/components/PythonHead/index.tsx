import styles from './index.module.css';
import {NavLink} from "react-router";
import {BookCheck, Play, SaveAll} from "lucide-react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Tooltip} from "antd";

type HeadControlItem = {
    key: string;          // 唯一标识符
    icon: React.ReactNode; // 图标组件
    tooltip: string;      // 提示文字
};

export default function PythonHead() {
    const {t} = useTranslation();
    const HeadControlItemR: HeadControlItem[] = [
        {
            key: 'publish',
            icon: <BookCheck className={styles.icon}/>,
            tooltip: t('publish')
        },
        {
            key: 'save',
            icon: <SaveAll className={styles.icon}/>,
            tooltip: t('save')
        }
    ]


    return (
        <header className={styles.head}>
            <NavLink to="/python">
                <div className={styles.logo}>Python</div>
            </NavLink>
            <div className={styles.r}>
                {HeadControlItemR.map((item) => (
                    <Tooltip key={item.key} title={item.tooltip} placement="bottom" color="#0769a1">
                        {item.icon}
                    </Tooltip>
                ))}
                <div className={styles.rl}>
                    <Tooltip title={t('run')} placement="bottom" color="#0769a1">
                        <Play color="green" className={styles.icon}/>
                    </Tooltip>
                    {/*<Tooltip title={t('stop')} placement="bottom" color="#0769a1">*/}
                    {/*    <CircleStop color="red" className={styles.icon}/>*/}
                    {/*</Tooltip>*/}
                </div>
            </div>
        </header>
    )
}