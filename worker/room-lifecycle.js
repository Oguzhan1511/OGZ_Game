// Shared by price guessing and auctions. Keep room membership, renew game identity.
export function returnToLobby(room) {
  room.lastGame = {
    mode: room.mode,
    finishedAt: Date.now(),
    players: room.players.map(({ id, name, avatar, score, balance, plate }) => ({
      id,
      name,
      avatar,
      score,
      ...(room.mode === 'auction' ? { balance, plate } : {}),
    })),
  };
  room.state = 'lobby';
  room.gameId = crypto.randomUUID();
  room.round = 0;
  room.expiresAt = Date.now() + 86400000;
  room.players.forEach(p => {
    p.score = 0;
    if (room.mode === 'auction') {
      p.balance = 20;
      p.plate = [];
    }
  });
  delete room.deadline;
  delete room.results;
  delete room.customCars;
  if (room.mode === 'auction') {
    room.items = [];
    room.bid = null;
    room.sales = [];
    room.lastSale = null;
  } else {
    room.order = [];
    room.guesses = {};
  }
}
