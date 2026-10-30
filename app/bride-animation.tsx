"use client";

import { useEffect, useRef, useState } from "react";

export default function BrideAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="footer-dance" ref={rootRef} data-playing={visible && !paused}>
      <svg className="bride-illustration" viewBox="0 0 240 260" role="img" aria-labelledby="bride-animation-title">
        <title id="bride-animation-title">A little bride twirling in her wedding dress</title>
        <defs>
          <linearGradient id="bridal-silk" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#e3d9c9" /><stop offset=".35" stopColor="#fffdf7" />
            <stop offset=".65" stopColor="#f6efe3" /><stop offset="1" stopColor="#d8c9b6" />
          </linearGradient>
        </defs>
        <ellipse className="bride-shadow" cx="120" cy="235" rx="61" ry="6" fill="#b39a78" opacity=".15" />
        <path d="M41 229Q120 250 199 229" fill="none" stroke="#b39a78" strokeWidth=".8" opacity=".45" strokeDasharray="2 5" />
        <g className="bride-sway">
          <g className="bride-veil">
            <path d="M118 41C99 63 88 106 70 153Q100 174 142 161C140 119 149 73 126 41Z" fill="#fffdf8" fillOpacity=".65" stroke="#c4b49d" strokeWidth=".7" />
            <path d="M121 48Q110 114 85 151M126 48Q142 110 133 156" fill="none" stroke="#d2c3ae" strokeWidth=".6" />
          </g>
          <g className="bride-turn">
            <path d="M108 48Q100 25 119 23Q141 22 136 48L132 69H107Z" fill="#615044" />
            <circle cx="134" cy="29" r="8" fill="#615044" />
            <path d="M116 52L115 66L126 70L130 62L126 51" fill="#e9cbb5" stroke="#aa8b75" strokeWidth=".6" />
            <g className="bride-face">
              <path d="M109 34Q106 53 119 57Q132 54 131 34Q119 41 109 34Z" fill="#efd3be" />
              <path d="M111 46L114 47M124 46L127 45M118 51Q121 53 124 50" fill="none" stroke="#806554" strokeWidth=".8" strokeLinecap="round" />
            </g>
            <path d="M113 64Q99 66 88 84L73 98M130 64Q145 69 152 85L170 78" fill="none" stroke="#d5b298" strokeWidth="7" strokeLinecap="round" />
            <path d="M73 98L66 96M170 78L176 73" stroke="#d5b298" strokeWidth="4" strokeLinecap="round" />
            <path d="M107 65Q119 77 134 65L131 92L108 92Z" fill="#fffdf7" stroke="#b39a78" strokeWidth=".8" />
            <path d="M108 71L131 86M132 72L109 86" stroke="#d5c6b1" strokeWidth=".7" fill="none" />
            <path d="M107 92Q120 96 132 92" fill="none" stroke="#ad9574" strokeWidth="2" />
          </g>
          <g className="bride-skirt">
            <path d="M108 94Q94 127 75 155Q59 187 39 221Q119 244 201 220Q167 184 152 150Q140 119 132 94Z" fill="url(#bridal-silk)" stroke="#bca98d" strokeWidth=".8" />
            <path d="M110 100Q98 165 67 224M116 100Q111 175 104 232M124 100Q133 179 144 231M130 100Q151 165 180 224" fill="none" stroke="#c6b69e" strokeWidth=".8" opacity=".7" />
            <path d="M53 215Q119 238 188 215M48 221Q121 243 195 221" fill="none" stroke="#bba88c" strokeWidth=".65" strokeDasharray="2 4" />
            <path d="M101 119L106 124L101 129L96 124ZM139 139L144 144L139 149L134 144ZM89 172L94 177L89 182L84 177ZM152 195L157 200L152 205L147 200Z" fill="#fffdf8" stroke="#c5b49a" strokeWidth=".55" />
          </g>
        </g>
        <g className="bride-sparkle" fill="none" stroke="#b39a78" strokeWidth="1">
          <path d="M53 62V74M47 68H59M181 119V129M176 124H186M175 43V51M171 47H179" />
          <circle cx="47" cy="151" r="1.5" /><circle cx="193" cy="83" r="1" />
        </g>
      </svg>
      <button className="footer-dance__toggle" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        {paused ? "Play animation" : "Pause animation"}
      </button>
    </div>
  );
}
