import React, { useState } from 'react';

function TestTraversal() {
    const [passedTests, setPassedTests] = useState(0);
    const [failedTests, setFailedTests] = useState(0); // stores {testID, indexOfDivergence}
    const [currentFailedTest, setCurrentFailedTest] = useState(0);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'spaceBetween', alignItems: 'top' }}>
            <p style={{ height: '21px', border: '1px solid black', borderRadius: '2px', margin: '0px 20px', padding: '0px' }}> Passed: {passedTests}/{passedTests + failedTests} </p>
            <p style={{ margin: '0px' }}>Failed tests: </p>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'spaceBetween', alignItems: 'center', marginLeft: '5px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'spaceBetween', alignItems: 'center' }}>
                    <button>{"<"}</button>
                    <p style={{ margin: '0px' }}> -- {currentFailedTest}/{failedTests} -- </p>
                    <button>{">"}</button>
                </div>
                <p style={{ margin: '0px' }}>file name</p>
            </div>
        </div>
    );
}

export default TestTraversal;