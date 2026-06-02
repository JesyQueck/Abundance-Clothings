import { SectionTitle, SubTitle, Bullet, Card, Row } from "@/components/ui/PRDComponents";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-text-secondary">
      <SectionTitle>About Abundance Clothing</SectionTitle>
      <p className="mb-8 text-lg leading-relaxed">
        Abundance Clothing is a premium streetwear brand built on the slogan <strong className="text-gold-primary">"Focus. Grow. Flourish."</strong> We believe in crafting high-quality, distinctive apparel that empowers individuals to express their unique style and journey.
      </p>

      <SubTitle>Our Philosophy</SubTitle>
      <Bullet>
        <strong>Focus:</strong> We meticulously design each piece with attention to detail, ensuring every stitch and fabric choice reflects our commitment to excellence.
      </Bullet>
      <Bullet>
        <strong>Grow:</strong> We are constantly evolving, pushing the boundaries of contemporary fashion while staying true to our roots of industrial brutalism meets premium streetwear.
      </Bullet>
      <Bullet>
        <strong>Flourish:</strong> Our goal is to inspire confidence and individuality, helping our community to thrive and make their mark on the world.
      </Bullet>

      <SubTitle>Our Craft</SubTitle>
      <Card>
        <Row label="Materials" value="Premium cotton blends, durable synthetics, custom hardware" />
        <Row label="Production" value="Ethically sourced and produced in Nigeria with skilled artisans" />
        <Row label="Design Ethos" value="Minimalist, functional, bold, and unapologetically unique" />
      </Card>

      <SubTitle>The Journey Ahead</SubTitle>
      <p className="mb-4 leading-relaxed">
        Phase 1 of abundanceclothing.com is just the beginning. We're building a solid foundation for future expansion, including:
      </p>
      <Bullet>Integrating with Supabase for a robust database and user authentication.</Bullet>
      <Bullet>Implementing secure payment gateways for a seamless checkout experience.</Bullet>
      <Bullet>Introducing advanced order tracking and customer loyalty programs.</Bullet>
      <Bullet>Expanding our collections and collaborating with cutting-edge designers.</Bullet>

      <p className="mt-8 text-center text-sm text-gold-primary">
        Thank you for being a part of the Abundance Clothing journey. Focus. Grow. Flourish.
      </p>
    </div>
  );
}
