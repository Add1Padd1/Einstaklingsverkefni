import DraftModeToggler from '@/components/DraftModeToggler';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { draftMode } from 'next/headers';
import { toNextMetadata } from 'react-datocms';

import './global.css';
import Link from 'next/link';

const query = graphql(
  /* GraphQL */ `
    query query {
      _site {
        faviconMetaTags {
          ...TagFragment
        }
      }
    }
  `,
  [TagFragment],
);

export async function generateMetadata() {
  const { isEnabled: isDraftModeEnabled } = draftMode();
  const data = await executeQuery(query, { includeDrafts: isDraftModeEnabled });
  return toNextMetadata(data._site.faviconMetaTags);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Link href="/" className="icon" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://www.datocms-assets.com/159923/1744678590-home.png"
              alt="Logo"
              style={{ width: '40px', height: '40px' }}
            />
          </Link>
          <Link href="/movies/comingsoon" className="pill">
            Væntanlegt
          </Link>
          <Link href="/movies/released" className="pill">
            Í bíó
          </Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
