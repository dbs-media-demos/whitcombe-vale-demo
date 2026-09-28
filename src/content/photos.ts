// Every photo on the site, graded by scripts/grade.mjs. Static imports give next/image
// intrinsic sizes and a blur placeholder (no layout shift). Sources: public/images/SOURCES.md
import type { StaticImageData } from "next/image";
import archCorridor from "@/assets/photos/arch-corridor.jpg";
import archLamp from "@/assets/photos/arch-lamp.jpg";
import archTwin from "@/assets/photos/arch-twin.jpg";
import blinds from "@/assets/photos/blinds.jpg";
import booksLadder from "@/assets/photos/books-ladder.jpg";
import booksRow from "@/assets/photos/books-row.jpg";
import bridgeDusk from "@/assets/photos/bridge-dusk.jpg";
import coffeeRoaster from "@/assets/photos/coffee-roaster.jpg";
import columnsAngle from "@/assets/photos/columns-angle.jpg";
import columns from "@/assets/photos/columns.jpg";
import conferenceCity from "@/assets/photos/conference-city.jpg";
import conferenceGreen from "@/assets/photos/conference-green.jpg";
import consultMugs from "@/assets/photos/consult-mugs.jpg";
import contractBw from "@/assets/photos/contract-bw.jpg";
import contractSign from "@/assets/photos/contract-sign.jpg";
import elderlyHands from "@/assets/photos/elderly-hands.jpg";
import fatherChild from "@/assets/photos/father-child.jpg";
import generationsHands from "@/assets/photos/generations-hands.jpg";
import handsChild from "@/assets/photos/hands-child.jpg";
import heroArch from "@/assets/photos/hero-arch.jpg";
import keysWood from "@/assets/photos/keys-wood.jpg";
import libraryReader from "@/assets/photos/library-reader.jpg";
import marbleHall from "@/assets/photos/marble-hall.jpg";
import officeDark from "@/assets/photos/office-dark.jpg";
import officeDesk from "@/assets/photos/office-desk.jpg";
import oldKeys from "@/assets/photos/old-keys.jpg";
import penNib from "@/assets/photos/pen-nib.jpg";
import penSign from "@/assets/photos/pen-sign.jpg";
import penWriting from "@/assets/photos/pen-writing.jpg";
import portraitCatherine from "@/assets/photos/portrait-catherine.jpg";
import portraitJulian from "@/assets/photos/portrait-julian.jpg";
import portraitSofia from "@/assets/photos/portrait-sofia.jpg";
import reflectingPool from "@/assets/photos/reflecting-pool.jpg";
import ringsBw from "@/assets/photos/rings-bw.jpg";
import ringsSuit from "@/assets/photos/rings-suit.jpg";
import shopOwner from "@/assets/photos/shop-owner.jpg";
import skylineBlue from "@/assets/photos/skyline-blue.jpg";
import skylineDusk from "@/assets/photos/skyline-dusk.jpg";
import skylineHaze from "@/assets/photos/skyline-haze.jpg";
import spiral from "@/assets/photos/spiral.jpg";
import stoneStairs from "@/assets/photos/stone-stairs.jpg";
import tailor from "@/assets/photos/tailor.jpg";
import towerGlass from "@/assets/photos/tower-glass.jpg";
import twoTalk from "@/assets/photos/two-talk.jpg";
import waxSeal from "@/assets/photos/wax-seal.jpg";
import windowDark from "@/assets/photos/window-dark.jpg";
import windowLight from "@/assets/photos/window-light.jpg";
import windowShadow from "@/assets/photos/window-shadow.jpg";

export const photos = {
  "arch-corridor": archCorridor,
  "arch-lamp": archLamp,
  "arch-twin": archTwin,
  "blinds": blinds,
  "books-ladder": booksLadder,
  "books-row": booksRow,
  "bridge-dusk": bridgeDusk,
  "coffee-roaster": coffeeRoaster,
  "columns-angle": columnsAngle,
  "columns": columns,
  "conference-city": conferenceCity,
  "conference-green": conferenceGreen,
  "consult-mugs": consultMugs,
  "contract-bw": contractBw,
  "contract-sign": contractSign,
  "elderly-hands": elderlyHands,
  "father-child": fatherChild,
  "generations-hands": generationsHands,
  "hands-child": handsChild,
  "hero-arch": heroArch,
  "keys-wood": keysWood,
  "library-reader": libraryReader,
  "marble-hall": marbleHall,
  "office-dark": officeDark,
  "office-desk": officeDesk,
  "old-keys": oldKeys,
  "pen-nib": penNib,
  "pen-sign": penSign,
  "pen-writing": penWriting,
  "portrait-catherine": portraitCatherine,
  "portrait-julian": portraitJulian,
  "portrait-sofia": portraitSofia,
  "reflecting-pool": reflectingPool,
  "rings-bw": ringsBw,
  "rings-suit": ringsSuit,
  "shop-owner": shopOwner,
  "skyline-blue": skylineBlue,
  "skyline-dusk": skylineDusk,
  "skyline-haze": skylineHaze,
  "spiral": spiral,
  "stone-stairs": stoneStairs,
  "tailor": tailor,
  "tower-glass": towerGlass,
  "two-talk": twoTalk,
  "wax-seal": waxSeal,
  "window-dark": windowDark,
  "window-light": windowLight,
  "window-shadow": windowShadow,
} satisfies Record<string, StaticImageData>;

export type PhotoKey = keyof typeof photos;
