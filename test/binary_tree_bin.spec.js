"use strict";

let BinaryTreeBin = require("../lib/binary_tree_bin");
let expect = require("chai").expect;

describe("BinaryTreeBin", () => {
    let bin;

    beforeEach(() => {
        bin = new BinaryTreeBin(1024, 1024);
    });

    it("is initially empty", () => {
        expect(bin.width).to.equal(0);
        expect(bin.height).to.equal(0);
    })

    it("adds rects correctly", () => {
        let position = bin.add(200, 100, {});
        expect(position.x).to.equal(0);
        expect(position.y).to.equal(0);
    });

    it("updates size correctly", () => {
        let position = bin.add(200, 100, {});
        expect(bin.width).to.equal(200);
        expect(bin.height).to.equal(100);
    });

    it("stores data correctly", () => {
        let position = bin.add(200, 100, {foo: "bar"});
        expect(bin.rects[0].data.foo).to.equal("bar");
    });

    it("fits squares correctly", () => {
        let i = 0;
        while(bin.add(100, 100, {number: i})) {
            // circuit breaker
            if (i++ === 1000) {
                break;
            }
        }
        expect(i).to.equal(100);
        expect(bin.rects.length).to.equal(100);
        expect(bin.width).to.equal(1000);
        expect(bin.height).to.equal(1000);

        bin.rects.forEach((rect, i) => {
            expect(rect.data.number).to.equal(i);
        })
    });

    it("monkey testing", () => {
        let rects = [];
        while (true) {
            let width = Math.floor(Math.random() * 200);
            let height = Math.floor(Math.random() * 200);

            let position = bin.add(width, height);
            if (position) {
                expect(position.width).to.equal(width);
                expect(position.height).to.equal(height);
                rects.push(position);
            } else {
                break;
            }
        }

        expect(bin.width).to.not.be.above(1024);
        expect(bin.height).to.not.be.above(1024);

        rects.forEach(rect1 => {
            // Make sure rects are not overlapping
            rects.forEach(rect2 => {
                if (rect1 !== rect2) {
                    let intersect =
                     (rect1.x < rect2.x + rect2.width &&
                      rect2.x < rect1.x + rect1.width &&
                      rect1.y < rect2.y + rect2.height &&
                      rect2.y < rect1.y + rect1.height);
                    expect(intersect).to.equal(false, "intersection detected: " + JSON.stringify(rect1) + " " + JSON.stringify(rect2));
                }
            });

            // Make sure no rect is outside bounds
            expect(rect1.x + rect1.width).to.not.be.above(bin.width);
            expect(rect1.y + rect1.height).to.not.be.above(bin.height);
        });
    });
});
