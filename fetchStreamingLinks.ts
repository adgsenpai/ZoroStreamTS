import axios from 'axios';

const BASE_URL = "https://api-aniwatch.onrender.com/";

async function searchAnime(query: string): Promise<any> {
    // anime/search?q={query}&page={page}
    const res = await axios.get(`${BASE_URL}anime/search?q=${query}`);
    return res.data;
}

async function searchAnimeReturnFirstResultID(query: string): Promise<any> {
    try {
        const res = await searchAnime(query);
        return res.animes[0].id;
    }
    catch (err) {
        console.log(err);
        return {
            id: ''
        }
    }
}

async function getAnimeEpisodes(animeID: string): Promise<any> {
    // anime/{id}/episodes
    const res = await axios.get(`${BASE_URL}anime/episodes/${animeID}`);
    return res.data;

}

async function getAnimeEpisodeIDByEpisodeNumber(animeID: string, episodeNumber: number): Promise<any> {
    const animeEpisodes = await getAnimeEpisodes(animeID);
    const totalAnimeEpisodes = animeEpisodes.totalEpisodes || 0;
    if (episodeNumber > totalAnimeEpisodes) {
        return {
            episodeId: ''
        }
    }
    const arrEpisodeNumber = episodeNumber - 1;
    const episodeID = animeEpisodes.episodes[arrEpisodeNumber].episodeId || '';
    return {
        episodeId: episodeID
    }
}

async function getAnimeEpisodeStreamingLinksEpisodeSlug(episodeSlug: string): Promise<any> {
    // https://api-aniwatch.onrender.com/anime/episode-srcs?id=steinsgate-3?ep=230&category=sub
    var data = [];
    // sub
    try {
        const resSub = await axios.get(`${BASE_URL}anime/episode-srcs?id=${episodeSlug}&category=sub`);
        // @ts-ignore  
        data.push(resSub.data);
    }
    catch (err) {
        // continue
    }

    // dub
    try {
        const resDub = await axios.get(`${BASE_URL}anime/episode-srcs?id=${episodeSlug}&category=dub`);
        // @ts-ignore
        data.push(resDub.data);
    }
    catch (err) {
        // continue

    }

    return data;
}

async function getAnimeEpisode(episodeNumber: number, animeName: string): Promise<any> {
    const animeID = await searchAnimeReturnFirstResultID(animeName);
    const episodeID = await getAnimeEpisodeIDByEpisodeNumber(animeID, episodeNumber);
    const episodeSlug = `${episodeID.episodeId}`;
    const episodeStreamingLinks = await getAnimeEpisodeStreamingLinksEpisodeSlug(episodeSlug);
    return episodeStreamingLinks;
}


// DEBUGGING 

getAnimeEpisode(1, "The Yuzuki Family's Four Sons").then((res) => {
    const util = require('util')
    console.log(util.inspect(res, { showHidden: false, depth: null }))
})