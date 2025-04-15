export type Movie = {
  id: string;
  movieimage: {
    url: string;
  };
  movietitle: string;
  movierating: string;
  movielength: string;
  moviepg: string;
  moviedescription: string;
};

export type Actor = {
  id: string;
  actorname: string;
  actorimage: {
    url: string;
  };
  kvikmynd: Movie[]; // Array of movies associated with the actor
};
