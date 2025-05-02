const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

// Paths
const SGF_DIR = path.join(__dirname, '../../SGF_Games');
const RESULTS_DIR = path.join(__dirname, '../results/failed_tests');

// Helper to save test results
const saveTestResult = (sgfFile, boardBefore, reduxStateBefore, breakingMove, reduxStateAfter, boardAfter) => {
    const testName = path.basename(sgfFile, '.sgf');
    const testDir = path.join(RESULTS_DIR, testName);

    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

    fs.writeFileSync(path.join(testDir, 'before.sgf'), boardBefore);
    fs.writeFileSync(path.join(testDir, 'redux_before.txt'), reduxStateBefore);
    fs.writeFileSync(path.join(testDir, 'breaking_move.txt'), breakingMove);
    fs.writeFileSync(path.join(testDir, 'redux_after.txt'), reduxStateAfter);
    fs.writeFileSync(path.join(testDir, 'after.sgf'), boardAfter);
};

(async function testGoGame() {
    const driver = await new Builder().forBrowser('firefox').build();

    try {
        // Load your Go game application
        await driver.get('http://localhost:3000'); // Replace with your app's URL

        // Iterate through SGF files
        const sgfFiles = fs.readdirSync(SGF_DIR).filter(file => file.endsWith('.sgf'));
        for (const sgfFile of sgfFiles) {
            const sgfPath = path.join(SGF_DIR, sgfFile);

            // Load SGF file into the game (assumes your app has an SGF loader)
            const sgfContent = fs.readFileSync(sgfPath, 'utf-8');
            await driver.executeScript(`loadSGF(${JSON.stringify(sgfContent)})`);

            // Simulate moves from the SGF file
            const moves = parseSGFMoves(sgfContent); // Implement this helper in helpers/parseSGF.js
            let reduxStateBefore, reduxStateAfter, breakingMove, boardBefore, boardAfter;

            for (const move of moves) {
                boardBefore = await driver.executeScript('return exportBoardToSGF()'); // Replace with your board export logic
                reduxStateBefore = await driver.executeScript('return getReduxState()'); // Replace with your Redux state getter
                await driver.executeScript(`makeMove(${JSON.stringify(move)})`); // Replace with your move-making logic

                // Check for unintentional behavior
                const isValid = await driver.executeScript('return validateMove()'); // Replace with your validation logic
                if (!isValid) {
                    reduxStateAfter = await driver.executeScript('return getReduxState()');
                    breakingMove = JSON.stringify(move);
                    boardAfter = await driver.executeScript('return exportBoardToSGF()'); // Replace with your board export logic

                    // Save the failed test result
                    saveTestResult(boardBefore, reduxStateBefore, breakingMove, reduxStateAfter, boardAfter);
                    break;
                }
            }
        }
    } finally {
        await driver.quit();
    }
})();