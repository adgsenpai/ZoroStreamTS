import axios from 'axios';
var levenshtein = require('fast-levenshtein');

const BASE_URL = "https://aniwatch.adgstudios.co.za/"

// Generic function for GET requests
async function get(url: string): Promise<any> {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return null;
    }
}

async function searchAnime(query: string): Promise<any> {
    return get(`${BASE_URL}anime/search?q=${query}`);
}

async function searchAnimeReturnFirstResultID(query: string): Promise<string> {
    const res = await searchAnime(query);
    return res?.animes[0]?.id || '';
}

async function getAnimeEpisodes(animeID: string): Promise<any> {
    return get(`${BASE_URL}anime/episodes/${animeID}`);
}

async function getAnimeEpisodeIDByEpisodeNumber(animeID: string, episodeNumber: number): Promise<string> {
    const animeEpisodes = await getAnimeEpisodes(animeID);
    if (episodeNumber > (animeEpisodes?.totalEpisodes || 0)) {
        return '';
    }
    return animeEpisodes?.episodes[episodeNumber - 1]?.episodeId || '';
}

async function getAnimeEpisodeStreamingLinks(episodeSlug: string, categories: string[]): Promise<any[]> {
    const data = [];
    for (const category of categories) {
        const res = await get(`${BASE_URL}anime/episode-srcs?id=${episodeSlug}&category=${category}`);
        // @ts-ignore
        if (res) data.push(res);
    }
    return data;
}

async function findBestAnimeMatch(query: string): Promise<{ score: number, name: string, animeId: string }> {
    // Remove this line if you want to use the query passed as a parameter
    // var query = "One Piece";

    try {
        const res = await searchAnime(query);

        let bestMatch = {
            score: Infinity,
            name: "",
            animeId: "",
        };

        for (let i = 0; i < res.animes.length; i++) {
            const anime = res.animes[i];

            // Check for anime.name
            if (anime.name) {
                try {
                    const score = levenshtein.get(query, anime.name);
                    if (score < bestMatch.score) {
                        bestMatch = { score: score, name: anime.name, animeId: anime.id };
                    }
                } catch (error) {
                    console.error('Error comparing names:', error);
                }
            }

            // Check for anime.jname
            if (anime.jname) {
                try {
                    const score = levenshtein.get(query, anime.jname);
                    if (score < bestMatch.score) {
                        bestMatch = { score: score, name: anime.jname, animeId: anime.id };
                    }
                } catch (error) {
                    console.error('Error comparing jnames:', error);
                }
            }
        }

        return bestMatch;

    } catch (error) {
        console.error('Error in findBestAnimeMatch:', error);
        return { score: Infinity, name: "", animeId: "" };
    }
}


async function getAnimeEpisode(episodeNumber: number, animeName: string): Promise<any> {
    //find best
    const animeID = await (await findBestAnimeMatch(animeName)).animeId;
    console.log("Anime ID: " + animeID);
    const episodeID = await getAnimeEpisodeIDByEpisodeNumber(animeID, episodeNumber);
    return getAnimeEpisodeStreamingLinks(episodeID, ['sub', 'dub']);
}

// DEBUGGING

/*
getAnimeEpisode(1, "The Yuzuki Family's Four Sons").then((res) => {
    const util = require('util');
    console.log(util.inspect(res, { showHidden: false, depth: null }));
});
*/

getAnimeEpisode(1, "One Piece").then((res) => {
    const util = require('util');
    console.log(util.inspect(res, { showHidden: false, depth: null }));
});