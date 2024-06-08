import Dexie from "dexie";

export const db = new Dexie("j-lineup");

db.version(1).stores({
  lineup: "++id, unitSongName, unitSongSetlist, members, center, creatorName"
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

