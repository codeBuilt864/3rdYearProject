import React, { useRef, useEffect } from "react";

export default function Result3D({ score = 85 }) {
  const rootRef = useRef(null);
  const state = useRef({ tx: 0, ty: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let raf = null;
    const target = { rx: 0, ry: 0 };

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      // map to -1..1
      const dx = (x - 0.5) * 2;
      const dy = (y - 0.5) * 2;
      // target rotations (degrees)
      target.ry = dx * 12; // rotateY
      target.rx = -dy * 12; // rotateX (invert so moving up tilts toward user)
    }

    function onLeave() {
      target.rx = 0;
      target.ry = 0;
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchmove", (ev) => {
      if (ev.touches && ev.touches[0]) onMove(ev.touches[0]);
    });
    el.addEventListener("touchend", onLeave);

    function animate() {
      // simple lerp for smoothness
      state.current.rx += (target.rx - state.current.rx) * 0.12;
      state.current.ry += (target.ry - state.current.ry) * 0.12;

      const rx = state.current.rx.toFixed(2);
      const ry = state.current.ry.toFixed(2);
      const inner = el.querySelector(".result-card-inner");
      const shine = el.querySelector(".result-shine");
      if (inner) {
        inner.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0px)`;
      }
      if (shine) {
        // move the shine opposite a bit for parallax
        shine.style.backgroundPosition = `${50 - state.current.ry}% ${50 - state.current.rx}%`;
      }

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center mt-8">
      <style>{`
        .result-outer { perspective: 1200px; }
        .result-card { width: 680px; max-width:90%; height:280px; display:flex; align-items:center; justify-content:center; }
        .result-card-inner { width:100%; height:100%; border-radius:20px; position:relative; transform-style:preserve-3d; transition: box-shadow 0.25s ease; will-change: transform; }
        .result-bg { position:absolute; inset:0; border-radius:20px; filter: blur(18px) saturate(120%); opacity:0.9; }
        .result-shine { position:absolute; inset:0; border-radius:20px; background: radial-gradient(600px 200px at 30% 20%, rgba(255,255,255,0.12), transparent 25%), linear-gradient(135deg, rgba(255,255,255,0.03), transparent 40%); mix-blend-mode: overlay; pointer-events:none; }
        .result-content { position:relative; z-index:2; display:flex; gap:28px; align-items:center; padding:28px; }
        .score-circle { width:160px; height:160px; border-radius:9999px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:48px; color:white; box-shadow: 0 8px 30px rgba(20,10,60,0.6); }
        .score-meta { color:rgba(255,255,255,0.9); }
        .meta-list { display:flex; flex-direction:column; gap:10px; }
        .meta-item { display:flex; gap:12px; align-items:center; }
        .meta-key { font-weight:700; color:rgba(255,255,255,0.8); }
        .meta-val { color:rgba(255,255,255,0.9); font-weight:700; }
      `}</style>

      <div className="result-outer" ref={rootRef}>
        <div className="result-card">
          <div className="result-card-inner">
            <div className="result-bg" style={{ background:
              'linear-gradient(135deg, rgba(123,92,255,0.35), rgba(166,108,255,0.25))'
            }} />
            <div className="result-shine" />
            <div className="result-content">
              <div className="score-circle" style={{ background: 'linear-gradient(180deg,#7B5CFF,#A66CFF)' }}>
                <div>{score}</div>
              </div>
              <div className="score-meta">
                <div className="meta-list">
                  <div className="meta-item"><div className="meta-key">ATS Match:</div><div className="meta-val">{Math.min(98, Math.max(40, score - 5))}%</div></div>
                  <div className="meta-item"><div className="meta-key">Content:</div><div className="meta-val">{Math.min(98, Math.max(30, score))}%</div></div>
                  <div className="meta-item"><div className="meta-key">Structure:</div><div className="meta-val">{Math.min(98, Math.max(25, score - 10))}%</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
