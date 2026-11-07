'use client';

import {useEffect,useRef,type ReactNode} from 'react';

export default function HeroParallax({children}:{children:ReactNode}) {
  const markerRef=useRef<HTMLDivElement>(null);
  const heroRef=useRef<HTMLElement>(null);

  useEffect(()=>{
    const hero=heroRef.current;const marker=markerRef.current;
    if(!hero||!marker)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const small=window.matchMedia('(max-width: 600px)');
    let start=0,height=1,frame=0;
    const current={x:0,y:0,scroll:0};const target={x:0,y:0,scroll:0};
    const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));

    function paint() {
      frame=0;
      if(reduced.matches)return;
      current.x+=(target.x-current.x)*.1;
      current.y+=(target.y-current.y)*.1;
      current.scroll+=(target.scroll-current.scroll)*.16;
      const strength=small.matches ? 0.55 : 1;
      const progress=current.scroll*strength;
      const set=(name:string,value:number,unit='px')=>hero!.style.setProperty(name,value.toFixed(4)+unit);
      set('--hero-bg-x',current.x*-18);set('--hero-bg-y',current.y*-12+progress*18);
      set('--hero-bg-scale',1.08+progress*.025,'');
      set('--hero-title-x',current.x*-12);set('--hero-title-y',current.y*-8-progress*56);
      set('--hero-subject-x',current.x*32);set('--hero-subject-y',current.y*18-progress*25);
      set('--hero-subject-scale',1+progress*.015,'');
      set('--hero-shadow-x',current.x*16);set('--hero-shadow-y',current.y*6-progress*8);
      if(Math.abs(target.x-current.x)+Math.abs(target.y-current.y)+Math.abs(target.scroll-current.scroll)>.001) frame=requestAnimationFrame(paint);
    }
    function schedule() {if(!reduced.matches&&!frame)frame=requestAnimationFrame(paint);}
    function onScroll() {target.scroll=clamp((window.scrollY-start)/height,0,1);schedule();}
    function measure() {start=marker!.getBoundingClientRect().top+window.scrollY;height=hero!.offsetHeight||1;onScroll();}
    function onPointer(event:PointerEvent) {
      if(event.pointerType!=='mouse'||reduced.matches||target.scroll>=1)return;
      if(!(event.target instanceof Element)||!event.target.closest('.bridal-hero,.site-header--editorial')||event.target.closest('.site-nav')) {resetPointer();return;}
      target.x=clamp(event.clientX/window.innerWidth*2-1,-1,1);
      target.y=clamp(event.clientY/Math.min(height,window.innerHeight)*2-1,-1,1);
      schedule();
    }
    function resetPointer() {if(!target.x&&!target.y)return;target.x=0;target.y=0;schedule();}
    function preferenceChanged() {
      cancelAnimationFrame(frame);frame=0;
      current.x=current.y=current.scroll=target.x=target.y=target.scroll=0;
      hero!.dataset.parallax=reduced.matches?'off':'on';
      measure();
    }
    function visibilityChanged() {
      if(document.hidden){cancelAnimationFrame(frame);frame=0;}
      else {resetPointer();measure();}
    }
    const resize=new ResizeObserver(measure);resize.observe(hero);
    window.addEventListener('pointermove',onPointer,{passive:true});
    document.documentElement.addEventListener('pointerleave',resetPointer,{passive:true});
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',measure,{passive:true});
    window.addEventListener('blur',resetPointer);
    document.addEventListener('visibilitychange',visibilityChanged);
    reduced.addEventListener('change',preferenceChanged);
    preferenceChanged();
    return ()=>{
      cancelAnimationFrame(frame);resize.disconnect();delete hero.dataset.parallax;
      window.removeEventListener('pointermove',onPointer);document.documentElement.removeEventListener('pointerleave',resetPointer);
      window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',measure);window.removeEventListener('blur',resetPointer);
      document.removeEventListener('visibilitychange',visibilityChanged);reduced.removeEventListener('change',preferenceChanged);
      for(const key of ['bg-x','bg-y','bg-scale','title-x','title-y','subject-x','subject-y','subject-scale','shadow-x','shadow-y'])hero.style.removeProperty('--hero-'+key);
    };
  },[]);

  return <><div ref={markerRef} aria-hidden="true" style={{height:0,pointerEvents:'none'}}/><section ref={heroRef} className="bridal-hero scroll-panel" aria-labelledby="bridal-hero-title">{children}</section></>;
}
