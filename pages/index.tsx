import styles from '../styles/Home.module.css'
import Canvas from '../components/Canvas/Canvas'
import Toolbar from '../components/Toolbar/ToolBar';

export default function Home() {
  return (
    <>
      <Toolbar />
      <div className={styles.container}>
        <Canvas />
      </div >
    </>

  )
}
