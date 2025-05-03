const parseSGFMoves = (sgfContent) => {
    if (sgfContent === '') return [];
    const moves = [];
    const moveRegex = /(;[BW]\[([a-z]{2})\])/g;
    let match;

    while ((match = moveRegex.exec(sgfContent)) !== null) {
        const color = match[1][1]; // 'B' or 'W'
        const coords = match[2];  // e.g., 'dd'
        moves.push({ color, coords });
    }
    return moves;
};

export default parseSGFMoves;