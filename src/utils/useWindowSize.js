// import React from "react";

// export default function useWindowSize() {
//     const isSSR = typeof window !== "undefined";
//     const [windowSize, setWindowSize] = React.useState({
//         width: isSSR ? 1200 : window.innerWidth,
//         height: isSSR ? 800 : window.innerHeight,
//     });

//     function changeWindowSize() {
//         setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//     }

//     React.useEffect(() => {
//         window.addEventListener("resize", changeWindowSize);

//         return () => {
//             window.removeEventListener("resize", changeWindowSize);
//         };
//     }, []);

//     return windowSize;
// }

import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
