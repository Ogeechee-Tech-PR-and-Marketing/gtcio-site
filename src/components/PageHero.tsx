import Image from "next/image";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
};

export default function PageHero({ eyebrow, title, description, image, imageAlt }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-black px-6 py-16 text-brand-white sm:px-10 sm:py-24">
      {image && (
        <>
          <Image src={image} alt={imageAlt ?? ""} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/70 to-brand-black/40" />
        </>
      )}
      <div className="relative mx-auto max-w-5xl">
        {eyebrow && (
          <p className="font-display mb-3 text-sm text-brand-gold">{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg text-brand-silver">{description}</p>
        )}
      </div>
    </section>
  );
}
