import ProgressOverlay from "@/components/ProgressBar/ProgressOverlay";

export default function ExploreLayout({ children }) {
  return (
    <>
      <ProgressOverlay />
      {children}
    </>
  );
}
