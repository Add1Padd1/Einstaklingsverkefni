import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { notFound } from 'next/navigation';
import styles from '../movies.module.css';
import Link from 'next/link';

export const metadata = {
  title: 'Kvikmyndasíða',
};
const query = graphql(
  /* GraphQL */ `
    query Movie($id: ItemId) {
      movie(filter: { id: { eq: $id } }) {
        id
        movieimage {
          url
        }
        movietitle
        movierating
        movielength
        moviepg
        moviedescription
        released
        releaseDate
        movieactors {
          actorimage {
            url
          }
          actorname
          id
        }
      }
    }
  `,
  [],
);
export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  /* revalidateTag('datocms-movies-title'); */

  const { id } = await params;

  const { movie } = await executeQuery(query, { variables: { id } });
  console.log(movie);
  if (!movie) {
    notFound();
  }
  return (
    <>
      <div className={styles.movieContainer}>
        <div className={styles.imageColumn}>
          <img src={movie.movieimage.url} alt={movie.movietitle} className={styles.movieImage} />
        </div>
        <div className={styles.detailsColumn}>
          <p className={styles.movieTitle}>{movie.movietitle}</p>
          {movie.released && (
            <>
              <p>Rating: {movie.movierating}</p>
              <p>PG: {movie.moviepg}</p>
              <p>Length: {movie.movielength}</p>
            </>
          )}
          <p className={styles.description}>{movie.moviedescription}</p>
          {!movie.released && (
            <>
              <p className={styles.releaseDate}>Release Date: {movie.releaseDate}</p>
            </>
          )}
        </div>
      </div>
      <h3>Actors:</h3>
      <ul className={styles.actorList}>
        {movie.movieactors.map((actor) => {
          return (
            <Link href={`/movies/${movie.id}/${actor.id}`} key={actor.actorname}>
              <div key={actor.actorname} className={styles.actorItem}>
                <h3>{actor.actorname}</h3>
                <img
                  src={actor.actorimage.url}
                  alt={actor.actorname}
                  className={styles.actorImage}
                />
              </div>
            </Link>
          );
        })}
      </ul>
    </>
  );
}
