import { Link } from "@solidjs/router";
import "./index.sass";
import { createSignal, For } from "solid-js";

const steps = ["STEP 1", "STEP 2", "STEP 3", "STEP 4"];

export function Navbar() {
  const [step] = createSignal(0);

  function getClassName(i: number): string {
    return step() == i
      ? "active"
      : step() == i + 1
      ? "waiting waiting-left"
      : step() == i - 1
      ? "waiting waiting-right"
      : "hidden";
  }

  return (
    <nav class="navbar">
      <Link class="navbar--link navbar--link-prev" href="/prev">&lt;</Link>
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
          <li class="navbar--dots--dot active">
            <span />
          </li>
          <li class="navbar--dots--dot">
            <span />
          </li>
          <li class="navbar--dots--dot">
            <span />
          </li>
        </ul>
      </div>
      <Link class="navbar--link navbar--link-next" href="/next">&gt;</Link>
    </nav>
  );
}
