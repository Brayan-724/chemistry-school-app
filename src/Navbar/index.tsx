import { useNavigate } from "@solidjs/router";
import "./index.sass";
import { createSignal, For } from "solid-js";

const steps = ["Data Register", "STEP 2", "STEP 3", "STEP 4"];

export function Navbar() {
  const navigator = useNavigate();
  const [step, setStep] = createSignal(parseInt(window.location.pathname.split("/").pop() ?? "0") || 0);
  let isChanging = false;

  function getClassName(i: number): string {
    return step() == i
      ? "active"
      : step() == i + 1
      ? "waiting waiting-left"
      : step() == i - 1
      ? "waiting waiting-right"
      : "hidden";
  }

  function getClassOfDot(i: number): string {
    return step() >= i ? "active" : "";
  }

  function changeStep(delta: number) {
    if (isChanging) return;
    setStep((step) => {
      if (step + delta < 0) return 0;
      if (step + delta >= steps.length) return steps.length - 1;

      isChanging = true;
      setTimeout(() => isChanging = false, 1000);
      navigator(`/step/${step + delta}`);
      return step + delta;
    });
  }

  return (
    <nav class="navbar">
      <button
        class="navbar--link navbar--link-prev"
        onClick={() => changeStep(-1)}
      >
        &lt;
      </button>
      <div class="navbar--island">
        <ul class="navbar--steps">
          <li class={`navbar--steps--step ${getClassName(-1)}`} data-spacer />
          <For each={steps}>
            {(item, index) => (
              <li class={`navbar--steps--step ${getClassName(index())}`}>
                <span>{item}</span>
              </li>
            )}
          </For>
          <li
            class={`navbar--steps--step ${getClassName(steps.length)}`}
            data-spacer
          />
        </ul>
        <ul class="navbar--dots">
          <For each={steps}>
            {(_item, index) => (
              <li class={`navbar--dots--dot ${getClassOfDot(index())}`}>
                <span />
              </li>
            )}
          </For>
        </ul>
      </div>
      <button
        class="navbar--link navbar--link-next"
        onClick={() => changeStep(1)}
      >
        &gt;
      </button>
    </nav>
  );
}

// <Link class="navbar--link navbar--link-next" href="/next">&gt;</Link>
