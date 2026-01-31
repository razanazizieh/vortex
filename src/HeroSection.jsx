import { useState, useEffect, useRef } from "react";
import "./App.css";
import "@splinetool/viewer";
import { Menu, X } from "lucide-react";

function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const cleanSpline = () => {
      const viewer = document.querySelector("spline-viewer");
      if (viewer && viewer.shadowRoot) {
        const style = document.createElement("style");
        style.innerHTML = `
          #logo, #shadow, .spline-watermark { display: none !important; opacity: 0 !important; pointer-events: none !important; }
        `;
        viewer.shadowRoot.appendChild(style);
        clearInterval(interval);
      }
    };
    const interval = setInterval(cleanSpline, 10);

    let requestRef;
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      cancelAnimationFrame(requestRef);
      requestRef = requestAnimationFrame(() => {
        if (window.innerWidth > 1024 && overlayRef.current) {
          const xPos = (clientX - window.innerWidth / 2) / 35;
          const yPos = (clientY - window.innerHeight / 2) / 35;
          overlayRef.current.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
        const cards = document.querySelectorAll(".bento-card");
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          card.style.setProperty("--x", `${x}px`);
          card.style.setProperty("--y", `${y}px`);
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(requestRef);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="vortex-app">
      <div className="side-tag-dual fade-in">
        <div className="tag-line">PRECISION & FUTURE</div>
        <div className="tag-line secondary">SYSTEMS — 2026</div>
      </div>
      <div className={`mobile-sidebar ${isOpen ? "show" : ""}`}>
        <button className="close-sidebar-btn" onClick={() => setIsOpen(false)}>
          <X size={32} color="#b388ff" />     
        </button>
        <div className="sidebar-links">
          <a href="#home" onClick={() => setIsOpen(false)}>
            Home          
          </a>
          <a href="#features" onClick={() => setIsOpen(false)}>
            Features
          </a>
          <a href="#labs" onClick={() => setIsOpen(false)}>
            Labs        
          </a>
        </div>
        <div className="sidebar-footer">
          <button className="btn-solid" style={{ width: "100%" }}>
            GET STARTED      
          </button>
        </div>
      </div>
      <nav className="navbar fade-in-down">
        <div className="logo">
          VORTEX<span className="dot">.</span>     
        </div>
        <div className="nav-pill desktop-only">
           <div className="nav-item active">Home</div>       
          <div className="nav-item">Features</div>         
          <div className="nav-item">
            Join<span className="arrow"> ↗</span>         
          </div>
        </div>
        <div className="nav-btn-dark-wrapper">
          <button className="nav-btn-dark desktop-only">GET STARTED</button>   
          {!isOpen && (
            <button
              className="mobile-toggle-btn"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={32} />         
            </button>
          )}
        </div>
      </nav>
      <main className="hero-section">
        <div className="overlay-content" ref={overlayRef}>
          <div className="text-area fade-in-left">
            <span className="kicker">UNLEASH THE POWER OF</span>   
            <h1 className="title">
              VORTEX<span className="dot">.</span>         
            </h1>
            <p className="desc">
              Crafting the digital future with autonomous systems.
            </p>
            <div className="btns">
              <button className="btn-solid">START CREATION</button>           
              <button className="btn-glass">Explore Labs</button>         
            </div>
          </div>
          <div className="bento-footer fade-in-up">
            <div className="bento-card fluted">
              <span className="label">POWER INDEX</span>         
              <div className="value">
                100<span className="unit">X</span>           
              </div>
            </div>
            <div className="bento-card fluted">
              <span className="label">RELIABILITY</span>         
              <div className="value">
                99.9<span className="unit">%</span>           
              </div>
            </div>
          </div>
        </div>
        <div className="spline-bg fade-in">
          <spline-viewer
            url="https://prod.spline.design/PGrouzE-nkmHN1Pt/scene.splinecode"
            hint="false"
            loading="eager"
          />
        </div>
      </main>
    </div>
  );
}

export default HeroSection;
