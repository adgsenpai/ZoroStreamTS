# ZoroStreamTS
A TypeScript library for efficient retrieval of streaming links from the Zoro server, with easy integration and robust error handling.

## Features

- Search for anime by name.
- Retrieve the first result's ID from a search query.
- Fetch all episodes of a given anime by ID.
- Find a specific episode by number.
- Retrieve streaming links for a specific episode.
- Utilize Levenshtein distance to find the best match for a given anime name.

## Installation

Before installing, ensure you have Node.js installed. Then, run the following command in your project directory:

```bash
npm install
```

## Usage

Import the functions from the library to start fetching anime data:

```typescript
import { getAnimeEpisode } from 'path-to-library';

// Example usage
getAnimeEpisode(1, "One Piece").then((res) => {
    console.log(res);
});
```

## API Functions

- `searchAnime(query: string)`: Searches for animes based on a query string.
- `searchAnimeReturnFirstResultID(query: string)`: Returns the ID of the first anime in the search result.
- `getAnimeEpisodes(animeID: string)`: Fetches all episodes for a given anime ID.
- `getAnimeEpisodeIDByEpisodeNumber(animeID: string, episodeNumber: number)`: Retrieves the ID of a specific episode by its number.
- `getAnimeEpisodeStreamingLinks(episodeSlug: string, categories: string[])`: Gets streaming links for an episode in specified categories (e.g., 'sub', 'dub').
- `findBestAnimeMatch(query: string)`: Finds the best match for an anime name using Levenshtein distance.

## Debugging

Uncomment the debugging section in the code to test the functionality with an example query.


## Credits

This project utilizes the [aniwatch-api](https://github.com/ghoshritesh12/aniwatch-api) developed by Ritesh Ghosh. Special thanks to their contributions and efforts in providing an efficient API for anime data retrieval.

## Contributing

Contributions to this project are welcome. Please ensure to follow the existing code style and add unit tests for any new or changed functionality.

