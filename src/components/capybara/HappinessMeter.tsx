interface HappinessMeterProps {
  /** 0 to 1 */
  happiness: number;
  pulsing: boolean;
}

/** Visual happiness bar — no numbers, just feeling */
const HappinessMeter = ({ happiness, pulsing }: HappinessMeterProps) => {
  const clampedHappiness = Math.min(1, Math.max(0, happiness));

  return (
    <div className="w-full space-y-2">
      <p className="text-sm text-muted-foreground font-heading text-center">
        {clampedHappiness < 0.3
          ? "Capybara is sleepy…"
          : clampedHappiness < 0.7
          ? "Capybara is content ☺"
          : "Capybara is so happy! ♥"}
      </p>
      <div className="w-full h-4 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full bg-accent transition-all duration-500 ease-out ${
            pulsing ? "animate-meter-pulse" : ""
          }`}
          style={{ width: `${clampedHappiness * 100}%` }}
        />
      </div>
    </div>
  );
};

export default HappinessMeter;
