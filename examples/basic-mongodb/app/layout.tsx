import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Next-RBAC Basic MongoDB Example',
  description: 'Example application demonstrating next-rbac with MongoDB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
