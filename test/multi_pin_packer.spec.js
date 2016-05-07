"use strict";

let MultiBinPacker = require("../lib/multi_bin_packer");
let expect = require("chai").expect;

describe("MultiBinPacker", () => {
    let packer;
    beforeEach(() => {
        packer = new MultiBinPacker(1024, 1024);
    });

    context("#add", () => {
        it("adds first element correctly", () => {
            packer.add(1000, 1000, {number: 1});
            expect(packer.bins[0].rects[0].data.number).to.equal(1);
        });

        it("creates additional bin if element doesn't fit in existing bin", () => {
            packer.add(1000, 1000, {number: 1});
            packer.add(1000, 1000, {number: 2});
            expect(packer.bins.length).to.equal(2);
            expect(packer.bins[1].rects[0].data.number).to.equal(2);
        });

        it("adds to existing bins if possible", () => {
            packer.add(1000, 1000, {number: 1});
            packer.add(1000, 1000, {number: 2});
            packer.add(10, 10, {number: 3});
            packer.add(10, 10, {number: 4});
            expect(packer.bins.length).to.equal(2);
        });

        it("allows oversized elements to be added", () => {
            packer.add(1000, 1000, {number: 1});
            packer.add(2000, 2000, {number: 2});
            expect(packer.bins[1].rects[0].width).to.equal(2000);
            expect(packer.bins[1].rects[0].oversized).to.equal(true);
        });
    });

    context("#sort", () => {
        it("does not mutate input array", () => {
            let input = [
                {width: 1, height: 1},
                {width: 2, height: 2}
            ];
            packer.sort(input);
            expect(input[0].width).to.equal(1);
        });

        it("works correctly", () => {
            let input = [
                {width: 1, height: 1},
                {width: 3, height: 1},
                {width: 2, height: 2}
            ];
            let output = packer.sort(input);
            expect(output[0].width).to.equal(3);
            expect(output[1].width).to.equal(2);
            expect(output[2].width).to.equal(1);
        });
    });

    context("#addArray", () => {
        it("adds multiple elements to bins", () => {
            let input = [
                {width: 1000, height: 1000, data: {number: 1}},
                {width: 1000, height: 1000, data: {number: 2}}
            ];
            packer.addArray(input);
            expect(packer.bins.length).to.equal(2);
        });

        it("adds the big rects first", () => {
            let input = [
                {width: 600, height: 20, data: {number: 1}},
                {width: 600, height: 20, data: {number: 2}},
                {width: 1000, height: 1000, data: {number: 3}},
                {width: 1000, height: 1000, data: {number: 4}}
            ];
            packer.addArray(input);
            expect(packer.bins.length).to.equal(2);
        });
    });
});
