interface PageHeadingProps {
  title: string;
}

export default function PageHeading({ title }: PageHeadingProps) {
  return (
    <div className="py-6 flex justify-end items-center px-4">
      <span className="text-5xl">{title}</span>
    </div>
  );
}
