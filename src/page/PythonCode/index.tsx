import PythonHead from "@/components/PythonHead";
import PythonFooter from "@/components/PythonFooter";
import PythonControl from "@/components/PythonControl";
import CodeMirror from "@/components/CodeMirror";
import Term from "@/components/Term";
import styles from "./index.module.css";


export default function PythonCode() {
    return (
        <>
            <div className={styles.python}>
                <PythonHead/>
                <div className={styles.content}>
                    <PythonControl/>
                    <div className={styles.r}>
                        <CodeMirror style= {{maxHeight:'calc(100vh - var(--foot-height) - var(--head-height))'}} />
                        <Term/>
                    </div>
                </div>
                <PythonFooter/>
            </div>
        </>
    )
}