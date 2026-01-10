import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  magicLinkUrl: string;
}

export function MagicLinkEmail({ magicLinkUrl }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to your account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Sign in to your account</Heading>
          <Text style={text}>
            Click the button below to sign in. This link will expire in 10
            minutes.
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={magicLinkUrl}>
              Sign In
            </Button>
          </Section>
          <Text style={text}>
            Or copy and paste this link into your browser:
          </Text>
          <Link href={magicLinkUrl} style={link}>
            {magicLinkUrl}
          </Link>
          <Text style={footer}>
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "560px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600" as const,
  lineHeight: "1.25",
  margin: "0 0 20px",
};

const text = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 16px",
};

const buttonSection = {
  margin: "24px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600" as const,
  lineHeight: "1",
  padding: "16px 24px",
  textDecoration: "none",
};

const link = {
  color: "#2563eb",
  fontSize: "14px",
  wordBreak: "break-all" as const,
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "24px 0 0",
};

export default MagicLinkEmail;
