import capybaraImg from "@/assets/capybara.png";

interface CapybaraProps {
  bouncing: boolean;
}

/** Cute capybara illustration with bounce animation on task completion */
const Capybara = ({ bouncing }: CapybaraProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={capybaraImg}
        alt="A cute capybara sitting in a hot spring"
        className={`w-36 h-36 object-contain drop-shadow-md ${bouncing ? "animate-capy-bounce" : ""}`}
      />
    </div>
  );
};

export default Capybara;
