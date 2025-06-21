import {Link, Cpu, Unplug, HardDriveUpload, SquareTerminal, Settings} from 'lucide-react';
import {useDispatch, useSelector} from "react-redux";
import styles from './index.module.css'
import logo from '@/assets/logo.svg'
import {Modal, Segmented, Select, Tooltip} from "antd";
import {useTranslation} from 'react-i18next';
import React, {useState} from "react";
import type {RootState} from "@/store";

type ControlItem = {
    key: string;          // 唯一标识符
    icon: React.ReactNode; // 图标组件
    tooltip: string;      // 提示文字
};


export default function Control() {
    const dispatch = useDispatch();
    const {termShow} = useSelector((state: RootState) => state.terminal);
    const {doc} = useSelector((state: RootState) => state.code);
    const {baudRate} = useSelector((state: RootState) => state.esp);
    const {t, i18n} = useTranslation();

    const [modal, setModal] = useState<boolean>(false);
    const [seg, setSeg] = useState<string | number>('system');

    const [binModal,setBinModal] = useState<boolean>(false)

    const controlItemsT: ControlItem[] = [
        {
            key: 'link',
            icon: <Link className={styles.icon} onClick={() => dispatch.esp.onConnect()}/>,
            tooltip: t('link'),
        },
        {
            key: 'init',
            icon: <Cpu className={styles.icon} onClick={() => setBinModal(true)}/>,
            tooltip: t('init'),
        },
        {
            key: 'unlink',
            icon: <Unplug className={styles.icon} onClick={() => dispatch.esp.onDis()}/>,
            tooltip: t('unlink'),
        },
    ];

    const controlItemsB: ControlItem[] = [
        {
            key: 'upload',
            icon: <HardDriveUpload className={styles.icon} onClick={()=>dispatch.esp.onWriteManiPy({script:doc,flash:false}) } />,
            tooltip: t('upload'),
        },
        {
            key: 'term',
            icon: <SquareTerminal className={styles.icon} onClick={() => dispatch.terminal.setTermShow(!termShow)}/>,
            tooltip: t('term'),
        },
        {
            key: 'set',
            icon: <Settings className={styles.icon} onClick={() => setModal(true)}/>,
            tooltip: t('set'),
        }
    ];
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng).then()
    };






    return (
        <>
            {/*set*/}
            <Modal
                title={t('set')}
                centered
                open={modal}
                onCancel={() => setModal(false)}
                footer={null}
            >
                <Segmented options={[{label: t('system'), value: 'system'}, {label: t('firmware_set'), value: 'firmware_set'}]}
                           value={seg} onChange={setSeg}/>
                {
                    seg === 'system' && (
                        <div className={styles.select}>
                            <div>{t('lng')}：</div>
                            <Select
                                defaultValue="zh"
                                onChange={changeLanguage}
                                style={{width: 'fit-content', padding: '0 2px'}}
                                options={[
                                    {value: 'zh', label: '中文'},
                                    {value: 'en', label: 'English'},
                                ]}
                            />
                        </div>
                    )
                }
                {
                    seg === 'firmware_set' && (
                        <div className={styles.select}>
                            <div>{t('baud_rate')}：</div>
                            <Select
                                defaultValue={baudRate}
                                onChange={(value)=> dispatch.esp.setBaudRate(value)}
                                style={{width: 'fit-content', padding: '0 2px'}}
                                options={[
                                    {value: 115200, label: '115200'},
                                    {value: 230400, label: '230400'},
                                    {value: 460800, label: '460800'},
                                    {value: 921600, label: '921600'},
                                ]}
                            />
                        </div>
                    )
                }
            </Modal>
            {/*bin*/}
            <Modal
                title={t('init')}
                centered
                open={binModal}
                onCancel={() => setBinModal(false)}
                footer={null}
            >


            </Modal>
            <div className={styles.control}>
                <div className={styles.t}>
                    <img className={styles.logo} src={logo} alt={t('name')}/>
                    <div className={styles.line}></div>
                    {controlItemsT.map((item) => (
                        <Tooltip key={item.key} title={item.tooltip} placement="right" color="#0769a1">
                            {item.icon}
                        </Tooltip>
                    ))}
                </div>
                <div className={styles.b}>
                    {controlItemsB.map((item) => (
                        <Tooltip key={item.key} title={item.tooltip} placement="right" color="#0769a1">
                            {item.icon}
                        </Tooltip>
                    ))}
                </div>
            </div>
        </>
    )
};

