import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { revalidateTag } from 'next/cache';
import styles from '../movies.module.css';

export const metadata = {
  title: 'Kvikmyndasíða',
};
const query = graphql(
  /* GraphQL */ `
    query Movies {
      allMovies(filter: { released: { eq: true } }) {
        id
        movieimage {
          filename
          url
        }
        movietitle
        movierating
        movielength
        moviepg
        moviedescription
        movieactors {
          actorname
          actorimage {
            id
          }
        }
      }
    }
  `,
  [],
);
export default async function ReleasedMoviesPage() {
  revalidateTag('datocms-movies-released');
  const { allMovies } = await executeQuery(query, {});
  console.log(allMovies);
  if (!allMovies) {
    notFound();
  }
  return (
    <>
      <h3>Í bíó:</h3>

      <div className={styles.movieGrid}>
        {/* @ts-expect-error */}
        {allMovies.slice(0, 6).map((movie) => {
          // Limit to 6 movies (2 per row, 3 rows max)
          return (
            <Link href={`/movies/${movie.id}`}>
              <div key={movie.movietitle} className={styles.movieItem}>
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
