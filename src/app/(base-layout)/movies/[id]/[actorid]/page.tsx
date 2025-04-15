import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Kvikmyndasíða',
};
const query = graphql(
  /* GraphQL */ `
    query Actor($actorid: ItemId) {
      actor(filter: { id: { eq: $actorid } }) {
        id
        actorname
        actorimage {
          url
        }
        kvikmynd {
          id
          movietitle
          movieimage {
            url
          }
        }
      }
    }
  `,
  [],
);
export default async function ActorPage({ params }: { params: Promise<{ actorid: string }> }) {
  const { actorid } = await params;

  const { actor } = await executeQuery(query, { variables: { actorid } });
  console.log(actor);
  if (!actor) {
    notFound();
  }
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* @ts-expect-error */}
        <h3>{actor.actorname}</h3>

        {/* Actor Image */}

        <img
          /* @ts-expect-error */
          src={actor.actorimage.url}
          /* @ts-expect-error */
          alt={actor.actorname}
          style={{ width: '300px', borderRadius: '8px', marginBottom: '20px' }}
        />

        {/* Movies (kvikmynd) */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h4>Movies:</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {/* @ts-expect-error */}
            {actor.kvikmynd.map((movie) => (
              <li key={movie.movietitle} style={{ marginBottom: '10px' }}>
                <Link
                  href={`/movies/${movie.id}`}
                  style={{ textDecoration: 'none', color: 'blue' }}
                >
                  <h5>{movie.movietitle}</h5>
                  {movie.movieimage?.url && (
                    <img
                      src={movie.movieimage.url}
                      alt={movie.movietitle}
                      style={{ width: '200px', borderRadius: '8px' }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
