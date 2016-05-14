"use strict";

let MultiBinPacker = require("../lib/multi_bin_packer");
let expect = require("chai").expect;
let AsciiTable = require("ascii-table")

const SCENARIOS = require("./scenarios.json");

describe("Efficiency", () => {
    let rectSizeSum;
    before(() => {
        rectSizeSum = SCENARIOS.map(scenario => {
            return scenario.reduce((memo, rect) => memo + rect.width * rect.height, 0);
        });
    });

    it("test", () => {
        const CANDIDATES = [
            {name: "1024x2048:0", factory: () => new MultiBinPacker(1024, 2048, 0)},
            {name: "1024x2048:1", factory: () => new MultiBinPacker(1024, 2048, 1)},
            {name: "1024x1024:0", factory: () => new MultiBinPacker(1024, 1024, 0)},
            {name: "1024x1024:1", factory: () => new MultiBinPacker(1024, 1024, 1)},
            {name: "2048:2048:1", factory: () => new MultiBinPacker(2048, 2048, 1)}
        ];


        let heading = ["#", "size"].concat(CANDIDATES.map(c => c.name));
        let results = CANDIDATES.map(candidate => meassureEfficiency(candidate.factory));
        let rows = SCENARIOS.map((scenario, i) => {
            return [i, rectSizeSum[i]].concat(results.map(resultCandidate => {
                let result = resultCandidate[i];
                return `${toPercent(result.efficieny)} (${result.bins} bins)`;
            }));
        }).concat([["sum", ""].concat(results.map(result => {
            let usedSize = result.reduce((memo, data) => memo + data.usedSize, 0);
            let rectSize = result.reduce((memo, data) => memo + data.rectSize, 0);
            return toPercent(rectSize / usedSize);
        }))]);


        console.log(new AsciiTable({ heading, rows }).toString());
    });

    function meassureEfficiency(factory) {
        return SCENARIOS.map((scenario, i) => {
            let packer = factory();
            packer.addArray(scenario);

            let bins = packer.bins.length;
            let rectSize = rectSizeSum[i];
            let usedSize = packer.bins.reduce((memo, bin) => memo + bin.width * bin.height, 0);
            let efficieny = rectSize / usedSize;
            return {bins, rectSize, usedSize, efficieny};
        });
    }

    function toPercent(input) {
        return Math.round(input * 1000) / 10 + "%";
    }
});
