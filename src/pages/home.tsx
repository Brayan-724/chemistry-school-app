import { Link } from '@solidjs/router';
import "./home.sass"

export default function Home() {
  return (
    <section class="home">
      <h1 class="home-title">WIP</h1>
      <Link href="/step/0"> Go to Steps &gt; </Link>
    </section>
  );
}
