'use strict;'

const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input' : rs, 'output': {}});
const map = new Map();
rl.on('line', (lineString) => {
    let value = lineString.split(',');
    let year = parseInt(value[0]);
    if (year === 2010 || year === 2015) {
        pref = value[2];
        prop = parseInt(value[7]);
        let v = map.get(pref);
        if (!v) {
            v = {
                prop10 : 0,
                prop15 : 0,
                change : 0
            };
        }
        if (year === 2010) {
            v.prop10 += prop;
        }
        if (year === 2015) {
            v.prop15 += prop;
        }
        map.set(pref, v);
    }
})
rl.resume();

rl.on('close', () => {
    for (let pair of map) {
        const v = pair[1];
        v.change = v.prop15 / v.prop10;
    }
    const arrayLines = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const arrayStrings = arrayLines.map((value) => {
        return value[0] + ': 2010 - ' + value[1].prop10 + ', 2015 - ' + value[1].prop15 + ', changes - ' + value[1].change;
    })
    console.log(arrayStrings);
})

