// this connect useSyncExternalStore is used to connect react to information outside of react, in this case we are connecting to the window.matchMedia API to check if the screen size is less than 1280px, and if it is we return true, otherwise we return false
import { useSyncExternalStore } from "react";

//this is css media query that checks if the screen size is less than 1280px
const query = "(max-width: 1279px)";

function subscribe(onChange) {
  // here the window represents the window of browser and matchMedial evaluates our condition of query and returns a MediaQueryList object that can be used to check if the media query matches the current state of the document, and addEventListener is used to listen for changes to the media query, and when it changes we call onChange to update the state of our component
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function useCompactLayout() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
