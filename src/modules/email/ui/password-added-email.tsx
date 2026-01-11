import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface PasswordAddedEmailProps {
  userName: string;
}

export function PasswordAddedEmail({ userName }: PasswordAddedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>A password was added to your Solaire account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Added</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            A password has been added to your Solaire account. You can now sign
            in using your email and password in addition to your existing login
            method.
          </Text>
          <Text style={footer}>
            If you didn&apos;t make this change, please contact our support team
            immediately.
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

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "24px 0 0",
};

export default PasswordAddedEmail;
