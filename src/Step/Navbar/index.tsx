import { useNavigate } from "@solidjs/router";
import { For } from "solid-js";
import { steps } from "../list";
import { useStepContext } from "..";
import "./index.sass";

export function Navbar() {
  const { actualStep: step, jumpTo } = useStepContext()!;
  const navigator = useNavigate();
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
    if (step() + delta < 0) return jumpTo(0);
    if (step() + delta >= steps.length) return jumpTo(steps.length - 1);

    isChanging = true;
    setTimeout(() => isChanging = false, 1000);
    navigator(`/step/${step() + delta}`);
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
                <span>{item.name}</span>
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
