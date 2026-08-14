// src/components/board/idle-message.tsx

type IdleMode = "default" | "dad-joke";

export function IdleMessage({ visible, mode = "default" }: { visible: boolean; mode?: IdleMode }) {
  if (!visible) return null;

  const label = mode === "dad-joke" ? "Idle · showing a dad joke" : "Idle · showing default message";

  return (
    <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-[.3em] text-muted/60">
      {label}
    </p>
  );
}
