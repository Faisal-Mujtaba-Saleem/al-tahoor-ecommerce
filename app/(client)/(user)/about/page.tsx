import Container from "@/components/Container";

const AboutPage = () => {
  return (
    <div className="">
      <Container className="max-w-6xl lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">About Al-Tahoor</h1>
        <p className="mb-4">
          Al-Tahoor is a premium healthcare and personal care company dedicated to providing
          high-quality medicated solutions for modern skin and hair needs. Founded in 2020,
          we&apos;ve quickly established ourselves as a trusted name in therapeutic personal care.
        </p>
        <p className="mb-4">
          Our mission is to empower individuals with products that truly work,
          helping them achieve healthier skin and hair through science-backed ingredients.
        </p>
        <p>
          At Al-Tahoor, we believe in the power of nature and science to transform
          your personal care routine. We&apos;re committed to staying at the
          forefront of dermatological advancements and delivering exceptional
          value to our customers.
        </p>
      </Container>
    </div>
  );
};

export default AboutPage;
