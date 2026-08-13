// src/components/board/idle-message.tsx

export function IdleMessage({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-[.3em] text-muted/60">
      Idle · showing default message
    </p>
  );
}
