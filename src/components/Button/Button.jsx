import clsx from "clsx";
import Link from "next/link";

export default function Button({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  Icon,
  className,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-normal transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "text-white bg-gradient-to-r from-[#1F2937] to-[#4E2971] hover:opacity-90 transition",
    outline:
      "border-2 border-gray bg-white text-dark-blue hover:bg-gray-50 focus:ring-gray-300",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm gap-1",
    md: "px-4 py-2.5 text-base gap-2",
    lg: "px-6 py-3 text-2xl gap-2",
  };

  const classes = clsx(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {Icon && <Icon className="w-5 h-5 mr-2" aria-hidden="true" />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {content}
    </button>
  );
}
