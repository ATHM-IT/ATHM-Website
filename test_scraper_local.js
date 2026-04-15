import handler from './api/enrich.js';

const req = {
    method: 'GET',
    query: {
        query: 'Asus ROG Strix RTX 3080 High Quality'
    }
};

const res = {
    setHeader: (k, v) => console.log(`Header: ${k} = ${v}`),
    status: (code) => {
        console.log(`Status: ${code}`);
        return res;
    },
    json: (data) => console.log('Result JSON:', JSON.stringify(data, null, 2)),
    end: () => console.log('End called')
};

async function run() {
    console.log('Running test...');
    await handler(req, res);
}

run();
