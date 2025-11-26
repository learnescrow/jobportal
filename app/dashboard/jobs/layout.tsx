import Breadcrumb from "@/components/Breadcrumb";

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="max-w-6xl mx-auto py-6 px-4 md:px-0">  
        <Breadcrumb />
      </div>
      {children}
    </section>
  );
}
