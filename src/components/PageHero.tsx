type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-brand-black px-6 py-16 text-brand-white sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        {eyebrow && (
          <p className="font-heading mb-3 text-sm font-bold tracking-widest text-brand-gold">{eyebrow}</p>
        )}
        <h1 className="font-heading text-4xl font-bold sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg text-brand-silver">{description}</p>
        )}
      </div>
    </section>
  );
}
