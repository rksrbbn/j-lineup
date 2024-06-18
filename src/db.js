import Dexie from "dexie";

export const db = new Dexie("j-lineup");

db.version(1).stores({
  lineup: "++id, unitSongName, unitSongSetlist, members, center, creatorName, showSetlist, backDancers",
  show: "++idShow, showName, showDate, showLocation, showMembers",
  showSongs: "++idShowSongs, showId, songName"
});

export const addLineup = async (lineup) => {
  return await db.lineup.add(lineup);
};

export const getLineup = async () => {
  return await db.lineup.toArray();
};

export const clearLineup = async () => {
  return await db.lineup.clear();
};

export const addShow = async (show) => {
  return await db.show.add(show);
};

export const getShow = async () => {
  return await db.show.toArray();
};

export const clearShow = async () => {
  return await db.show.clear();
};

export const addShowSongs = async (showId, songs) => {
  const showSongs = songs.map(song => ({
    showId: showId,
    songName: song
  }));
  return await db.showSongs.bulkAdd(showSongs);
};

export const getShowSongs = async () => {
  return await db.showSongs.toArray();
};

export const clearShowSongs = async () => {
  return await db.showSongs.clear();
};
