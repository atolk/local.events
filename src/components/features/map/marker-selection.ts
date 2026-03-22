/** Matches Leaflet `iconAnchor` y (pin tip); horizontal center of the 48px-wide icon. */
export const EVENT_MARKER_TRANSFORM_ORIGIN = "50% 64px";

export const EVENT_MARKER_ROOT_SELECTOR = "[data-event-marker-root]";

export const EVENT_MARKER_SCALE_INACTIVE = 0.833;
export const EVENT_MARKER_SCALE_ACTIVE = 1;

const OVERSHOOT_SELECT = 1.08;
const UNDERSHOOT_DESELECT = 0.78;

const ANIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 480,
  easing: "cubic-bezier(0.34, 1.2, 0.64, 1)",
  fill: "forwards",
};

const DESELECT_ANIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 400,
  easing: "cubic-bezier(0.34, 1.2, 0.64, 1)",
  fill: "forwards",
};

function cancelElementAnimations(element: HTMLElement): void {
  element.getAnimations?.().forEach((animation) => animation.cancel());
}

function setRestingTransform(root: HTMLElement, selected: boolean): void {
  const scale = selected ? EVENT_MARKER_SCALE_ACTIVE : EVENT_MARKER_SCALE_INACTIVE;
  root.style.transformOrigin = EVENT_MARKER_TRANSFORM_ORIGIN;
  root.style.transform = `scale(${scale})`;
}

function animateSelect(root: HTMLElement): void {
  cancelElementAnimations(root);
  root.style.transformOrigin = EVENT_MARKER_TRANSFORM_ORIGIN;
  if (typeof root.animate === "function") {
    root.animate(
      [
        { transform: `scale(${EVENT_MARKER_SCALE_INACTIVE})` },
        { transform: `scale(${OVERSHOOT_SELECT})`, offset: 0.55 },
        { transform: `scale(${EVENT_MARKER_SCALE_ACTIVE})` },
      ],
      ANIMATION_OPTIONS
    );
  } else {
    setRestingTransform(root, true);
  }
}

function animateDeselect(root: HTMLElement): void {
  cancelElementAnimations(root);
  root.style.transformOrigin = EVENT_MARKER_TRANSFORM_ORIGIN;
  if (typeof root.animate === "function") {
    root.animate(
      [
        { transform: `scale(${EVENT_MARKER_SCALE_ACTIVE})` },
        { transform: `scale(${UNDERSHOOT_DESELECT})`, offset: 0.5 },
        { transform: `scale(${EVENT_MARKER_SCALE_INACTIVE})` },
      ],
      DESELECT_ANIMATION_OPTIONS
    );
  } else {
    setRestingTransform(root, false);
  }
}

/**
 * First layout after mount: avoid spurious “deselect” animation; optional bubble when already selected (e.g. deep link).
 */
export function applyEventMarkerInitial(root: HTMLElement | null, selected: boolean): void {
  if (!root) {
    return;
  }
  cancelElementAnimations(root);
  root.style.transformOrigin = EVENT_MARKER_TRANSFORM_ORIGIN;
  if (selected) {
    animateSelect(root);
  } else {
    setRestingTransform(root, false);
  }
}

/**
 * Selection changed after mount: bubble up when selecting, settle down when deselecting.
 */
export function applyEventMarkerSelectionTransition(root: HTMLElement | null, selected: boolean): void {
  if (!root) {
    return;
  }
  if (selected) {
    animateSelect(root);
  } else {
    animateDeselect(root);
  }
}
