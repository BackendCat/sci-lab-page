import { useCallback, useState } from "react";
import type { ReactNode } from "react";

import clsx from "clsx";

import styles from "./ApproachSwitcher.module.css";

type Approach = "dsl" | "sdk";

type ApproachSwitcherProps = {
  dslContent: ReactNode;
  sdkContent: ReactNode;
  onSwitch?: (approach: Approach) => void;
};

export const ApproachSwitcher = ({
  dslContent,
  sdkContent,
  onSwitch,
}: ApproachSwitcherProps) => {
  const [approach, setApproach] = useState<Approach>("dsl");

  const handleSwitch = useCallback(
    (a: Approach) => {
      setApproach(a);
      onSwitch?.(a);
    },
    [onSwitch],
  );

  return (
    <>
      <div className={styles.switcher}>
        <button
          className={clsx(styles.btn, approach === "dsl" && styles.active)}
          onClick={() => handleSwitch("dsl")}
        >
          DSL Engine
        </button>
        <span className={styles.arrow}>&rarr;</span>
        <button
          className={clsx(styles.btn, approach === "sdk" && styles.active)}
          onClick={() => handleSwitch("sdk")}
        >
          Framework SDK
        </button>
      </div>
      <div className={clsx(styles.panel, approach !== "dsl" && styles.hidden)}>
        {dslContent}
      </div>
      <div className={clsx(styles.panel, approach !== "sdk" && styles.hidden)}>
        {sdkContent}
      </div>
    </>
  );
};
