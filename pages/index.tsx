import styles from '../styles/Home.module.css'
import Canvas from '../components/Canvas/Canvas'
import Toolbar from '../components/Toolbar/ToolBar';

export default function Home() {

  return (
    <div>
      <Toolbar />
      <div className={styles.scrollContainer}>
        <div className={styles.scroll}>
          <div className={styles.container}>
          </div>
          <Canvas />
        </div >
      </div>
    </div>

  )
}
