
import styled from "styled-components"

import styles from "./details.module.css";

const Anchor = styled.a`
    font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto,
    segoe ui, arial, sans-serif;
    font-weight: 400;
    font-size: 16px;
    color: inherit;
    position: absolute;
    display: inline;
    text-decoration: none;
    z-index: 1000;
    pointer-events: all;
`

const Details = () => { 
    return (
        <>
        <Anchor href="https://github.com/KorieDrakeChaney" className={styles.topRight}  target="_blank">Github</Anchor>
        <Anchor href="https://github.com/KorieDrakeChaney/Zustand-Demo" className={styles.bottomRight}  target="_blank" ><source /></Anchor>
        <Anchor href="https://www.instagram.com/tina.henschel/"className={styles.bottomLeft} target="_blank">Illustrations @ Tina Henschel</Anchor>
        <span className={styles.headerLeft}>Zustand-Demo</span>
        </>
    )
}


export default Details