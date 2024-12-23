import { BiCloset, BiMenu, BiUser } from "react-icons/bi";
import { BsCart } from "react-icons/bs";
import { CgClose, CgCloseR } from "react-icons/cg";
import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Controller } from "swiper/modules";
import pears from "./assets/pears.png";
import apples from "./assets/apples.png";
import passion from "./assets/passion.png";
import { gsap } from "gsap";

function App() {
  const [backgroundPosition, setBackgroundPosition] = useState("0% center");

  // <----------------------Animation part ------------------------> 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navItemsRef = useRef(null);
  const timeline = useRef(null);
  
  useEffect(() => {
    if (!sidebarRef.current || !navItemsRef.current) return;

    // Set initial positions
    gsap.set(sidebarRef.current, { right: "-100%" });
    gsap.set(navItemsRef.current.children, { x: 50, opacity: 0 });

    timeline.current = gsap
      .timeline({ paused: true })
      .to(sidebarRef.current, {
        right: "0%",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(
        navItemsRef.current.children,
        {
          x: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        "-=0.2"
      );
  }, []);

  const handleOpen = () => {
    timeline.current?.play();
    setSidebarOpen(true);
  };
  const handleClose = () => {
    timeline.current?.reverse().then(() => setSidebarOpen(false));
  };

   // <----------------------Animation part End ------------------------>  

  // References for both Swipers
  const mainSwiperRef = useRef(null);
  const secondSwiperRef = useRef(null);

  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  const homeHeight = () => {
    const home = document.querySelector(".home");
    const mockup = document.querySelector(".home-mockup");

    if (home && mockup) {
      home.style.height = `${mockup.offsetHeight + 313}px`;
    }
  };
  const handleSlideChange = (swiper) => {
    const index = swiper.realIndex;
    const newPosition =
      index === 0 ? "0% center" : index === 1 ? "50% center" : "100% center";
    setBackgroundPosition(newPosition);
  };
  const scrollHeader = () => {
    const scrolled = window.scrollY >= 50;
    setIsHeaderScrolled(scrolled);
  };

  // useeffect for adding event listeners on scroll resize and load 
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", scrollHeader);
      // Initial call to set height
      homeHeight();

      // Add event listeners
      window.addEventListener("resize", homeHeight);
      window.addEventListener("load", homeHeight);

      // Cleanup
      return () => {
        window.removeEventListener("resize", homeHeight);
        window.removeEventListener("load", homeHeight);
      };
    }
  }, []);

  return (
    <div>
      <header
        className={`fixed top-0 left-0 w-full z-50 ${
          isHeaderScrolled ? "bg-header" : ""
        }`}
      >
        <nav className="nav h-[5.5rem] max-w-[1568px] p-[1rem] px-8 relative">
          {!sidebarOpen && (
            <a href="#" className="nav-logo font-semibold text-2xl mx-5">
              Fruity
            </a>
          )}

          {/* Large screens navbar */}
          <div className="hidden md:flex items-center justify-between mx-auto">
            <ul className="nav-list flex gap-8">
              {[
                "Shop",
                "Flavours",
                "Our Location",
                "Partnership",
                "Contact",
              ].map((link, index) => (
                <li key={index} className="nav-item navlink">
                  <a href="#" className="nav-link text-black">
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            <div onClick={handleClose} className="nav-close md:hidden ">
              <CgClose />
            </div>
          </div>

          <div
            ref={sidebarRef}
            className="md:hidden fixed top-0 h-screen w-[50dvw] p-5 overflow-hidden backdrop-blur-[50px]"
            style={{
              zIndex: 9999,
              right: "-100%", // Initial position
            }}
          >
            <CgCloseR className="mb-4 cursor-pointer" onClick={handleClose} />
            <div className="text-black flex flex-col justify-start items-start gap-8">
              <h2>Fruity</h2>
              <ul
                ref={navItemsRef}
                className="flex flex-col gap-7 w-full h-full text-white"
              >
                <li className="cursor-pointer">Shop</li>
                <li className="cursor-pointer">Partnership</li>
                <li className="cursor-pointer">Discounts</li>
                <li className="cursor-pointer">Our Location</li>
                <li className="cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>

          <div className="nav-actions text-lg flex gap-4">
            {!sidebarOpen && (
              <>
                <BiUser />
                <BsCart />
                <div className="nav-toggle md:hidden" onClick={handleOpen}>
                  <BiMenu />
                </div>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <section className="home">
          {/* Main Swiper */}
          <Swiper
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            onSlideChange={handleSlideChange}
            speed={2000}
            modules={[Autoplay, Controller]}
            className="h-full"
            controller={{ control: secondSwiperRef.current }}
            onSwiper={(swiper) => {
              mainSwiperRef.current = swiper;
            }}
          >
            {[
              { title: "Pears", color: "hsl(79, 66%, 72%)" },
              { title: "Apple", color: "hsl(0, 100%, 85%)" },
              { title: "Exotic", color: "hsl(242, 66%, 85%)" },
            ].map((slide, index) => (
              <SwiperSlide
                key={index}
                className="home-data h-full"
                style={{
                  backgroundColor: slide.color,
                  fontSize: "clamp(5.5rem, -1.1667rem + 33.333vw, 28rem)",
                }}
              >
                <h2 className="home-title font-semibold text-white absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 !z-[1000]">
                  {slide.title}
                </h2>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Background mockup */}
          <div
            className="home-mockup"
            style={{
              backgroundPosition: `${backgroundPosition}, center`,
              backgroundSize: "300% 100%, 100% 100%",
              backgroundRepeat: "no-repeat, no-repeat",
              backgroundBlendMode: "multiply",
              maskSize: "100% 100%",
              maskRepeat: "no-repeat",
            }}
          />

          {/* Second Swiper */}
          <Swiper
            loop={true}
            direction="vertical"
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            speed={2000}
            modules={[Autoplay, Controller]}
            className="secondswiper !absolute !inset-0 pointer-events-none"
            controller={{ control: mainSwiperRef.current }}
            onSwiper={(swiper) => {
              secondSwiperRef.current = swiper;
            }}
          >
            {[
              { img: pears, color: "hsl(79, 66%, 72%)" },
              { img: apples, color: "hsl(0, 100%, 85%)" },
              { img: passion, color: "hsl(242, 66% 85%)" },
            ].map((slide, index) => (
              <SwiperSlide key={index} className="home-fruit">
                <img
                  src={slide.img}
                  alt=""
                  className="home-fruit-img max-w-screen !absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Github Code Button  */}
          <a
            href="/"
            className="absolute -bottom-11 left-[50%] -translate-x-[50%] z-[150]"
          >
            <button className="bg-white p-3 text-black font-semibold rounded-3xl w-full h-full">
              Link to Code on Github
            </button>
          </a>
        </section>
      </main>
    </div>
  );
}

export default App;
