"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedHeritage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="heritage-film" ref={rootRef} data-playing={visible && !paused}>
      <svg className="heritage-film__scene" viewBox="0 0 2731 4096" role="img" aria-labelledby="heritage-film-title">
        <title id="heritage-film-title">A Galvan Sposa bridal illustration twirling and raising her arms</title>
        <defs>
          <path id="heritage-left-arm-shape" d="M1260 970Q1241 985 1250 1130L1253 1370Q1220 1550 1207 1725L1174 1915L1167 2015L1220 2075L1252 1930L1267 1760L1320 1500L1340 1135L1322 997Z" />
          <path id="heritage-right-arm-shape" d="M1738 990Q1785 1000 1786 1100L1782 1390L1835 1640L1908 1900L1938 2065L1905 2020L1882 1950L1870 2045L1844 1945L1825 1840L1760 1650L1725 1435L1715 1110Z" />
          <clipPath id="heritage-left-arm-clip"><use href="#heritage-left-arm-shape" /></clipPath>
          <clipPath id="heritage-right-arm-clip"><use href="#heritage-right-arm-shape" /></clipPath>
          <mask id="heritage-body-only" maskUnits="userSpaceOnUse" x="0" y="0" width="2731" height="4096">
            <rect width="2731" height="4096" fill="white" />
            <use href="#heritage-left-arm-shape" fill="black" />
            <use href="#heritage-right-arm-shape" fill="black" />
          </mask>
          <linearGradient id="heritage-upper-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" /><stop offset=".36" stopColor="white" /><stop offset=".41" stopColor="black" /><stop offset="1" stopColor="black" />
          </linearGradient>
          <linearGradient id="heritage-skirt-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="black" /><stop offset=".36" stopColor="black" /><stop offset=".41" stopColor="white" /><stop offset="1" stopColor="white" />
          </linearGradient>
          <mask id="heritage-upper"><rect width="2731" height="4096" fill="url(#heritage-upper-fade)" /></mask>
          <mask id="heritage-skirt"><rect width="2731" height="4096" fill="url(#heritage-skirt-fade)" /></mask>
        </defs>
        <g className="heritage-film__figure">
          <g className="heritage-film__turn">
          <g mask="url(#heritage-body-only)">
          <g mask="url(#heritage-skirt)">
            <image className="heritage-film__skirt" href="/assets/about/heritage.png" width="2731" height="4096" />
          </g>
          <g mask="url(#heritage-upper)">
            <image className="heritage-film__bodice" href="/assets/about/heritage.png" width="2731" height="4096" />
          </g>
          </g>
          <g className="heritage-film__arm heritage-film__arm--left">
            <image href="/assets/about/heritage.png" width="2731" height="4096" clipPath="url(#heritage-left-arm-clip)" />
          </g>
          <g className="heritage-film__arm heritage-film__arm--right">
            <image href="/assets/about/heritage.png" width="2731" height="4096" clipPath="url(#heritage-right-arm-clip)" />
          </g>
          </g>
        </g>
        <g className="heritage-film__sparkles" stroke="#b39a78" strokeWidth="4" fill="none">
          <path d="M900 940v52m-26-26h52M1910 1620v44m-22-22h44M700 2410v40m-20-20h40M2160 2870v44m-22-22h44" />
          <circle cx="2050" cy="1100" r="6" /><circle cx="600" cy="1910" r="5" />
        </g>
      </svg>
      <button className="heritage-film__toggle" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        {paused ? "Play illustration" : "Pause illustration"}
      </button>
    </div>
  );
}
