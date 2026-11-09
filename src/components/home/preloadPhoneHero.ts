import { preload } from "react-dom";
import { getImageProps } from "next/image";
import heroPhone from "@/assets/photos/hero-phone.jpg";

/**
 * The phone hero's photo is the phone's LCP: fetched from the <head>, ahead of the scripts. Same sizes as
 * Threshold; the media query is lib/gsap's PHONE_QUERY (a client module, so not importable here).
 * Previews also call it first thing, before waiting for the CRM, so it still makes the <head>.
 */
export function preloadPhoneHero() {
  const sizes = "(min-width: 768px) 28rem, 90vw";
  const { props } = getImageProps({ src: heroPhone, alt: "", fill: true, quality: 75, sizes });
  preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: sizes, fetchPriority: "high", media: "(max-width: 767px), (pointer: coarse)" });
}
