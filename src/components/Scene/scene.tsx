import { useEffect, useRef, MutableRefObject } from "react";
import Background from "../../logic/background";
import style from "./scene.module.css"


const Scene = () => { 
    const ref = useRef() as MutableRefObject<HTMLCanvasElement>;
  
    useEffect(() => {
      if(ref.current){
        new Background(ref.current);
      }
    }, [ref])
  
    return ( 
      <canvas ref={ref}
      className={style.scene}
      />
    )
  }
  
  
  export default Scene;