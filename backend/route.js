const express = require('express');
const router = express.Router();
const prove = require("./logic");

router.route("/prove")
    .post(async (req, res) => {
        // const inputs = {
        //   nullifierHash:
        //     14744269619966411208579211824598458697587494354926760081771325075741142829156n,
        //   nullifier: 0,
        //   secret: 0,
        //   root: 1,
        //   inclusionProof: [
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //   ],
        // };
        if (!req?.body) {
            return res.status(400).json({ message: "No input data" });
        }
        data = req.body
        const result = await prove(data);
        console.log(result);
        res.json(result);
        return;
    })
    .get(async (req, res) => {
        const inputs = {
            nullifierHash:
            14744269619966411208579211824598458697587494354926760081771325075741142829156n,
            nullifier: 0,
            secret: 0,
            root: 1,
            inclusionProof: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
        };
        const result = await prove(inputs);
        console.log(result);

        res.json(result);
    })

module.exports = router;