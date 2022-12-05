import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Canvas from '../components/Canvas/Canvas'
import Toolbar from '../components/Toolbar/ToolBar';

export default function Home() {
  const handlePencilClick = () => {
    // Gestisci l'evento onClick per il bottone della matita
  };

  const handleEraserClick = () => {
    // Gestisci l'evento onClick per il bottone della gomma
  };

  const handleColorPickerClick = () => {
    // Gestisci l'evento onClick per il bottone della tavolozza di colori
  };
  return (
    <>
      <Toolbar
        onPencilClick={handlePencilClick}
        onEraserClick={handleEraserClick}
        onColorPickerClick={handleColorPickerClick}
      />
      <div className={styles.container}>
        <Canvas />
      </div >
    </>

  )
}
