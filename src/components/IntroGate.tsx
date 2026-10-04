import { PropsWithChildren, useCallback, useState } from "react";
import { intro } from "../lib/intro";
import Preloader from "./Preloader";

/** Shows the preloader on the first visit of a session, then the page. */
const IntroGate = ({ children }: PropsWithChildren) => {
  const [preloading, setPreloading] = useState(() => !intro.played);
  const finish = useCallback(() => setPreloading(false), []);

  return (
    <>
      {preloading && <Preloader onFinish={finish} />}
      <main className="page-root">{children}</main>
    </>
  );
};

export default IntroGate;
