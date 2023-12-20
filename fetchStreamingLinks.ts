import axios from 'axios';

const BASE_URL = "https://api-aniwatch.onrender.com/";

// Generic function for GET requests
async function get(url: string): Promise<any> {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
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
        if (res) data.push(res);
    }
    return data;
}

async function getAnimeEpisode(episodeNumber: number, animeName: string): Promise<any> {
    const animeID = await searchAnimeReturnFirstResultID(animeName);
    const episodeID = await getAnimeEpisodeIDByEpisodeNumber(animeID, episodeNumber);
    return getAnimeEpisodeStreamingLinks(episodeID, ['sub', 'dub']);
}

// DEBUGGING
getAnimeEpisode(1, "The Yuzuki Family's Four Sons").then((res) => {
    const util = require('util');
    console.log(util.inspect(res, { showHidden: false, depth: null }));
});
