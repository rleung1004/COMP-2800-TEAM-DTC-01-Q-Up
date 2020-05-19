import React, { useState } from "react";
import "../styles/easterEgg.scss";
import isMobile from "../utils/mobileDetection";

/**
 * Deploy a smashing easter egg.
 * 
 * To insert easter egg in any page copy the folowing code into the parent component:
 * 
 * In JS body:
 * const [showEgg, setShowEgg] = useState({ value: false });
 *
 * const exitEgg = () => {
 *   setShowEgg({ value: false });
 * };
 * const startEgg = () => {
 *   setShowEgg({ value: true });
 * };
 * 
 * In JSX content: 
 * {showEgg.value ? <EasterEgg exitEgg={exitEgg} /> : <> </>}
 * 
 * @param props must contain a function named exitEgg that accepts no params
 */
export default function EasterEgg(props: any) {
  const arr: Array<any> = [];
  const [cracks, setCracks] = useState(arr);
  const [hammer, setHammer] = useState({ img: <></> });
  const clickHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const container = document.getElementById("container");
    const x = event.clientX;
    const y = event.clientY;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const imgWidth = Math.round(screenWidth * 0.2);
    const imgHeight = Math.round(screenHeight * 0.2);
    const styles = {
      glass: {
        position: "absolute" as "absolute",
        top: y - Math.round(imgHeight * 0.15),
        left: x - Math.round(imgWidth * 0.8),
        zIndex: 20,
      },
      hammer: {
        position: "absolute" as "absolute",
        top: y - Math.round(imgHeight * 0.15),
        left: x - Math.round(imgWidth * 0.6),
        zIndex: 30,
      },
    };

    const staticCrack = (
      <img
        src={require("../img/easter-egg/statickBreak.png")}
        style={styles.glass}
        alt="broken glass"
      />
    );

    const newHammer = (
      <img
        src={require("../img/easter-egg/animatedHammer.gif")}
        style={styles.hammer}
        alt="hammer"
      />
    );

    const whenIsMobile = () => {
      always();
    };

    const whenNotMobile = () => {
      if (!container) {
        return;
      }
      container.className = "removeCursor";
      always();
      setTimeout(() => {
        container.className = "applyCursor";
      }, 700);
    };

    const always = () => {
      // insert animated hammer
      setHammer({ img: newHammer });
      // insert crack
      setTimeout(() => {
        setCracks([staticCrack].concat(cracks.slice()));
        const audio = new Audio(require("../rsc/breakingGlass.mp3"));
        audio.play(); // remove animated hammer
        setTimeout(() => {
          setHammer({ img: <></> });
        }, 200);
      }, 400);
    };

    if (isMobile()) {
      whenIsMobile();
    } else {
      whenNotMobile();
    }
  };

  const exitClickHandler = () => {
    props.exitEgg();
  };

  return (
    <div id="container" onClick={clickHandler} className="applyCursor">
      <h1 onClick={exitClickHandler}>Do not smash this!</h1>
      {cracks}
      {hammer.img}
    </div>
  );
}
