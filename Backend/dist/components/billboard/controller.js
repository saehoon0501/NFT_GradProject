"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require("fs");
const sharp = require("sharp");
const BOARD = "/Users/saehoonbyun/Documents/GitHub/NFT_GradProject/Frontend/public/wholeSquare.png";
const INDIVIDUAL_SQUARE_EDGE_PIXELS = 10;
const COMPOSITE_SQUARE_EDGE_SQUARES = 50;
const NUM_SQUARES = COMPOSITE_SQUARE_EDGE_SQUARES * COMPOSITE_SQUARE_EDGE_SQUARES;
const updateMetaData = (row, col, url, description) => {
    const dataBuffer = fs.readFileSync("/Users/saehoonbyun/Documents/GitHub/NFT_GradProject/Frontend/public/BillboardData.json");
    const dataJSON = dataBuffer.toString();
    let data = JSON.parse(dataJSON);
    data[row][col].isOwned = true;
    data[row][col].link = url;
    data[row][col].description = description;
    fs.writeFileSync("/Users/saehoonbyun/Documents/GitHub/NFT_GradProject/Frontend/public/BillboardData.json", JSON.stringify(data));
};
module.exports = {
    personalize: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { squareNumber, rgbData, url, description } = req.body;
        const row = Math.floor((squareNumber - 1) / COMPOSITE_SQUARE_EDGE_SQUARES);
        const col = (squareNumber - 1) % COMPOSITE_SQUARE_EDGE_SQUARES;
        const composites = [];
        composites.push({
            input: Buffer.from(rgbData, "hex"),
            raw: {
                width: INDIVIDUAL_SQUARE_EDGE_PIXELS,
                height: INDIVIDUAL_SQUARE_EDGE_PIXELS,
                channels: 3,
            },
            left: INDIVIDUAL_SQUARE_EDGE_PIXELS * col,
            top: INDIVIDUAL_SQUARE_EDGE_PIXELS * row,
        });
        const inputFile = fs.existsSync(BOARD) ? BOARD : null;
        const inputBuffer = fs.readFileSync(inputFile);
        try {
            const output = yield sharp(inputBuffer)
                .composite(composites)
                .toFile(BOARD);
            updateMetaData(row, col, url, description);
            return res.send("updated");
        }
        catch (e) {
            return res.send(e);
        }
    }),
};
