"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function GsapWrapper({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.fromTo(
                ".animate-header",
                { autoAlpha: 0, y: 40 },
                { autoAlpha: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
            )
                .fromTo(
                    ".link-card-anim",
                    { autoAlpha: 0, x: -30 },
                    {
                        autoAlpha: 1,
                        x: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power2.out",
                    },
                    "-=0.4"
                )
                .fromTo(
                    ".animate-bottom",
                    { autoAlpha: 0, y: 20 },
                    { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
                    "-=0.2"
                );

            gsap.utils.toArray(".parallax-bg").forEach((layer: any) => {
                const depth = layer.dataset.depth || 0.2;
                gsap.to(layer, {
                    yPercent: -(depth * 100),
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full flex flex-col items-center relative overflow-hidden">
            {children}
        </div>
    );
}
