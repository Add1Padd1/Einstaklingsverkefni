import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './movies/movies.module.css';
import { Movie } from '@/types';

export const metadata = {
  title: 'Kvikmyndasíða',
};
const query = graphql(
  /* GraphQL */ `
    query AllMoviesSorted {
      allMovies(orderBy: movietitle_ASC) {
        id
        movieimage {
          url
        }
        movietitle
        movierating
        movielength
        moviepg
        moviedescription
      }
    }
  `,
  [],
);

/**
 * We use a helper to generate function that fits the Next.js
 * `generateMetadata()` format, automating the creation of meta tags based on
 * the `_seoMetaTags` present in a DatoCMS GraphQL query.
 */

export default async function FrontPage() {
  //@ts-expect-error
  const { allMovies }: { allMovies: Movie[] } = await executeQuery(query);

  if (!allMovies) {
    notFound();
  }

  return (
    <>
      <h3>All Movies:</h3>
      <div className={styles.movieGrid}>
        {allMovies.slice(0, 9).map((movie) => {
          // Limit to 9 movies (3 rows max)
          return (
            <Link href={`/movies/${movie.id}`} key={movie.id}>
              <div className={styles.movieItem}>
                <div className={styles.movieImageContainer}>
                  <img
                    src={movie.movieimage.url}
                    alt={movie.movietitle}
                    className={styles.movieImage}
                  />
                </div>
                <div className={styles.movieContent}>
                  <p className={styles.movieTitle}>{movie.movietitle}</p>
                  <p className={styles.movieDescription}>{movie.moviedescription}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
