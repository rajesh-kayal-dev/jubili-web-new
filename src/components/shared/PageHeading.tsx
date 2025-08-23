interface PageHeadingProps {
  title: string;
  icon?: string; // optional
}

export default function PageHeading({ title, icon }: PageHeadingProps) {
  return (
    <div className="py-6 flex justify-end items-center px-4">
      {icon && <img src={icon} alt="icon" className="mr-3 w-8 h-8" />}
      <div className="w-2"></div>
      <span className="text-5xl">{title}</span>
    </div>
  );
}
