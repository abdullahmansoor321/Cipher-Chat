function MessagesLoadingSkeleton() {
  const bubbles = [
    { mine: false, w: "60%" },
    { mine: true,  w: "45%" },
    { mine: false, w: "75%" },
    { mine: true,  w: "30%" },
    { mine: false, w: "55%" },
    { mine: true,  w: "65%" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-4">
      {bubbles.map((b, i) => (
        <div key={i} className={`flex items-end gap-2.5 ${b.mine ? "flex-row-reverse" : ""}`}>
          {!b.mine && (
            <div className="size-8 rounded-xl bg-white/[0.04] animate-pulse flex-shrink-0" />
          )}
          <div
            className={`h-10 rounded-2xl animate-pulse ${b.mine ? "bg-amber-500/10 rounded-br-md" : "bg-white/[0.04] rounded-bl-md"}`}
            style={{ width: b.w, maxWidth: "72%" }}
          />
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;
