import React, { useState } from "react";
import "../styles/easterEgg.scss";
import isMobile from "../utils/mobileDetection";

export default function EasterEgg(props: any) {
  const array: Array<any> = [];
  const [cracks, setCracks] = useState(array);
  const [hammer, setHammer] = useState({ img: <img /> });

  const clickHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const containerStyle = document.getElementById("container")?.style;
    const x = event.clientX;
    const y = event.clientY;

    const styles = {
      glass: {
        position: "absolute" as "absolute",
        top: y,
        left: x,
      },
      hammer: {
        position: "absolute" as "absolute",
        top: y - 15,
        left: x + 10,
      },
    };
    const newCrack = (
      <img src="../img/easter-egg/breakingGlass.gif" style={styles.glass} />
    );

    const newHammer = (
      <img src="../img/easter-egg/hammer.gif" style={styles.hammer} />
    );

    const whenIsMobile = () => {
      always();
    };

    const whenNotMobile = () => {
      if (!containerStyle) {
        return;
      }
      containerStyle.cursor = "none";
      always();
      setTimeout(
        () =>
          (containerStyle.cursor =
            "url('../img/easter-egg/hammerFrame.png'), auto"),
        48
      );
    };

    const always = () => {
      // insert animated hammer
      setHammer({ img: newHammer });
      // insert crack
      setTimeout(() => {
        setCracks([newCrack].concat(cracks.slice()));
        const audio = new Audio("../rsc/breakingGlass.wav");
        audio.play(); // remove animated hammer
        setTimeout(() => {
          setHammer({ img: <img /> });
        }, 40);
      }, 5);
    };

    if (isMobile()) {
      whenIsMobile;
    } else {
      whenNotMobile();
    }
  };

  const exitClickHandler = () => {
    props.exitEaster();
  };

  return (
    <div id="container" onClick={clickHandler}>
      <h1 onClick={exitClickHandler}>Do not smash this!</h1>
      {cracks.map((crack, key) => (
        <div key={key}>{crack}</div>
      ))}
      {hammer}
    </div>
  );
}
