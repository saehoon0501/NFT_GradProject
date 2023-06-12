import jwt from "jsonwebtoken";
import { User, UserModel } from "../users/model";
import { ethers } from "ethers";
import config from "../../config";

export = {
  sndNonce: (req, res, next) => {
    const randomBytes = ethers.BigNumber.from(ethers.utils.randomBytes(32));
    console.log("sending Nonce");
    return res.send(randomBytes._hex);
  },

  sndJwt: (req, res, next) => {
    const { publicAddress, signature, msg } = req.body;

    if (!publicAddress || !signature || !msg)
      return res
        .status(400)
        .send({ error: "Request should have 3 elements(publicAddr, sig, msg" });

    UserModel.findOne({ publicAddr: `${publicAddress}` }).then((user: User) => {
      if (!user) {
        return res.status(401).send({ error: "User not Found" });
      }
      const signedAddr = ethers.utils.verifyMessage(msg, signature);

      if (`${signedAddr.toLowerCase()}` != user.publicAddr) {
        return res.status(401).send({ error: "Signature verification failed" });
      }
      return res.json({
        accessToken: jwt.sign(
          { publicAddress },
          config.secretKey,
          config.options
        ),
      });
    });
  },
};
