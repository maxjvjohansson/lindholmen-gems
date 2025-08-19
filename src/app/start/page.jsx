import Button from "@/components/Button/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function StartPage() {
  return (
    <section>
      <div className="flex flex-col gap-4 w-full max-w-sm mb-10">
        <Button
          href="/explore"
          variant="primary"
          size="lg"
          Icon={PlayArrowIcon}
        >
          Start
        </Button>
      </div>
    </section>
  );
}
