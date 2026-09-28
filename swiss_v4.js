// Swiss V4 preview ranking helpers.
// Pairing stays separate from physical table assignment.

function rankSwissPlayers(players, nextRound) {
  return [...players].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;

    // Rounds 1-3: Rating (IK), then starting player number.
    if (nextRound <= 3) {
      return (b.rating || 0) - (a.rating || 0) || (a.pno || 9999) - (b.pno || 9999);
    }

    // From round 4: Buchholz WP -> Rating (IK) -> Buchholz WP Hi/Lo.
    return (b.buchholzWp || 0) - (a.buchholzWp || 0)
      || (b.rating || 0) - (a.rating || 0)
      || (b.buchholzHiLo || 0) - (a.buchholzHiLo || 0)
      || (a.pno || 9999) - (b.pno || 9999);
  });
}

module.exports = { rankSwissPlayers };
