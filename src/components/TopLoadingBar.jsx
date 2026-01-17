import { useEffect, useRef } from "react";
import { useNavigation } from "react-router";
import LoadingBar from "react-top-loading-bar";

export default function TopLoadingBar() {
  const { state } = useNavigation();
  const ref = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (state === "loading" || state === "submitting") {
      hasStartedRef.current = true;
      ref.current?.start();
    } else if (state === "idle" && hasStartedRef.current) {
      ref.current?.complete();
      hasStartedRef.current = false;
    }
  }, [state]);

  return (
    <LoadingBar
      color="var(--accent-11)"
      ref={ref}
      height={3}
      waitingTime={300}
      shadow={false}
    />
  );
}
