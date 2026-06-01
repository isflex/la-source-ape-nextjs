"use client";

import React, { useEffect, useRef } from "react";
import { default as stylesPage } from "@src/styles/scss/pages/roundtable.module.scss";

/**
 * Client controller for the marketing "Roundtable" SVG.
 *
 * The SVG itself stays server-rendered and is passed in as `children`; this
 * component never re-renders it. Instead it grabs the existing DOM nodes via a
 * ref and drives the animation by toggling CSS-module classes:
 *
 *  1. Idle (no hover on #Roundtable): auto-cycle label-0 → stages 1‑5 → label-0,
 *     6s per view, looping.
 *  2. Hover on #Roundtable: the timed cycle stops; hovering a `.stage` instantly
 *     shows its label and hides #label-0. Leaving #Roundtable resumes from label-0.
 *  3. Between automatic changes only, the outgoing/incoming labels spin 720°
 *     around #ellipse-1's centre (handled by the `.spin-in` / `.spin-out` CSS).
 */

const STEP_MS = 6000;
const SPIN_MS = 850; // slightly longer than the 0.8s CSS animation

export default function RoundtableController({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  /** On mobile the roundtable is shown statically — skip all animation logic. */
  disabled?: boolean;
}): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const root = containerRef.current;
    if (!root) return;

    const roundtable = root.querySelector<SVGGElement>("#roundtableGroup");
    const label0 = root.querySelector<SVGGElement>("#label-0");
    const stages = Array.from(
      root.querySelectorAll<SVGGElement>("[data-stage]"),
    ).sort(
      (a, b) => Number(a.dataset.stage ?? 0) - Number(b.dataset.stage ?? 0),
    );

    if (!roundtable || !label0 || stages.length === 0) return;

    // Project groups in document order (foulée-meudonnaise, dîner-des-parents,
    // collecte-de-noël). Empty array → reveal helpers below are no-ops.
    const projectGroups = Array.from(
      root.querySelectorAll<SVGGElement>("#apeProjectsGroup > g"),
    );

    // views[0] = #label-0, views[k] = stage k's #label-k group.
    const views: (Element | null)[] = [
      label0,
      ...stages.map((stage, i) => stage.querySelector(`#label-${i + 1}`)),
    ];
    const viewCount = views.length; // 1 + number of stages

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const currentRef = { value: 0 };
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let spinTimeoutId: ReturnType<typeof setTimeout> | null = null;

    // Switch the visible project group as the auto-cycle reaches a given view,
    // every two stages (n+2): stage 1 → group 0, stage 3 → group 1, stage 5 →
    // group 2. The three groups overlap in the same SVG slots, so only ONE is
    // shown at a time; it keeps rotating g0 → g1 → g2 → g0 … across loops.
    const PROJECT_AT_VIEW: Record<number, number> = { 1: 0, 3: 1, 5: 2 };
    const showOnlyProject = (i: number) =>
      projectGroups.forEach((g, idx) =>
        g.classList.toggle(stylesPage.projectVisible, idx === i),
      );
    const hideAllProjects = () =>
      projectGroups.forEach((g) =>
        g.classList.remove(stylesPage.projectVisible),
      );

    const showView = (i: number) => {
      if (i === 0) {
        label0.style.display = "block";
      } else {
        label0.style.display = "none";
        stages[i - 1]?.classList.add(stylesPage.active);
      }
    };

    const clearSpin = () => {
      if (spinTimeoutId) {
        clearTimeout(spinTimeoutId);
        spinTimeoutId = null;
      }
      views.forEach((v) =>
        v?.classList.remove(stylesPage.spinIn, stylesPage.spinOut),
      );
    };

    /** Instantly show view `i`, hiding everything else. */
    const showInstant = (i: number) => {
      clearSpin();
      stages.forEach((s) => s.classList.remove(stylesPage.active));
      showView(i);
    };

    /** Animated transition used by the auto-cycle only. */
    const transition = (from: number, to: number) => {
      if (from === to) return;
      if (prefersReducedMotion) {
        showInstant(to);
        return;
      }
      clearSpin();

      // Reveal the incoming view while keeping the outgoing one visible so both
      // can spin around the ellipse together.
      showView(to);

      const incoming = views[to];
      const outgoing = views[from];
      incoming?.classList.add(stylesPage.spinIn);
      outgoing?.classList.add(stylesPage.spinOut);

      spinTimeoutId = setTimeout(() => {
        incoming?.classList.remove(stylesPage.spinIn);
        outgoing?.classList.remove(stylesPage.spinOut);
        // Hide the outgoing view now that the incoming one has settled.
        if (from === 0) {
          label0.style.display = "none";
        } else {
          stages[from - 1]?.classList.remove(stylesPage.active);
        }
        spinTimeoutId = null;
      }, SPIN_MS);
    };

    const tick = () => {
      const next = (currentRef.value + 1) % viewCount;
      transition(currentRef.value, next);
      currentRef.value = next;
      // Auto-cycle only — hover-driven showInstant never reveals projects.
      const gi = PROJECT_AT_VIEW[next];
      if (gi !== undefined) showOnlyProject(gi);
    };

    const startAuto = () => {
      stopAuto();
      intervalId = setInterval(tick, STEP_MS);
    };

    function stopAuto() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    // --- hover wiring ------------------------------------------------------
    const onRoundEnter = () => {
      stopAuto();
      clearSpin();
      hideAllProjects();
    };
    const onRoundLeave = () => {
      clearSpin();
      showInstant(0);
      currentRef.value = 0;
      startAuto();
    };
    roundtable.addEventListener("mouseenter", onRoundEnter);
    roundtable.addEventListener("mouseleave", onRoundLeave);

    const stageHandlers = stages.map((stage, i) => {
      const onEnter = () => {
        stopAuto();
        showInstant(i + 1);
      };
      const onLeave = () => {
        showInstant(0);
      };
      stage.addEventListener("mouseenter", onEnter);
      stage.addEventListener("mouseleave", onLeave);
      return { stage, onEnter, onLeave };
    });

    // --- start -------------------------------------------------------------
    showInstant(0);
    currentRef.value = 0;
    startAuto();

    return () => {
      stopAuto();
      clearSpin();
      roundtable.removeEventListener("mouseenter", onRoundEnter);
      roundtable.removeEventListener("mouseleave", onRoundLeave);
      stageHandlers.forEach(({ stage, onEnter, onLeave }) => {
        stage.removeEventListener("mouseenter", onEnter);
        stage.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [disabled]);

  return (
    <div ref={containerRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
