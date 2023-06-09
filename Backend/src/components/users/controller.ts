import User = require("./user.model");
import { Post, Comment } from "../posts/post.model";

module.exports = {
  getProfile: (req, res, next) => {
    let publicAddress;

    if (req.query.userId == undefined) {
      publicAddress = res.locals.decoded.publicAddress;
      User.findOne(
        { publicAddr: `${publicAddress}` },
        {
          comment_ids: 0,
          likes_ids: 0,
          "profile.comment_ids": 0,
          "profile.likes_ids": 0,
        }
      )
        .then((user) => {
          if (!user) {
            return res.status(401).send({ error: "User not Found" });
          }

          return res.json(user);
        })
        .catch((err) => {
          console.log("유저 정보 sndProfile: User.findOne Error", err);
          return res.status(400).send(err);
        });
    } else {
      publicAddress = req.query.userId;
      User.findById({ _id: `${publicAddress}` })
        .then((user) => {
          if (!user) {
            return res.status(401).send({ error: "User not Found" });
          }
          return res.json(user);
        })
        .catch((err) => {
          console.log("유저 정보 sndProfile: User.findById Error", err);
          return res.status(400).send(err);
        });
    }
  },
  updateProfile: (req, res, next) => {
    const publicAddress = res.locals.decoded.publicAddress;

    const { caption, profileName, profile_pic } = req.body;

    if (caption || profileName) {
      User.updateOne(
        {
          publicAddr: `${publicAddress}`,
        },
        {
          $set: {
            "profile.username": `${profileName}`,
            "profile.caption": `${caption}`,
          },
        }
      )
        .then((result) => {
          console.log("updateProfile 실행 결과", result);
          return res.send("user info updated");
        })
        .catch((err) => {
          console.log("updateProfile: User.updateOne Error", err);
          return res.status(400).send(err);
        });
    }

    if (profile_pic) {
      User.updateOne(
        {
          $and: [
            { publicAddr: `${publicAddress}` },
            { "ownerOfNFT.NFT_URL": `${profile_pic}` },
          ],
        },
        {
          $set: { "profile.profile_pic": `${profile_pic}` },
        }
      )
        .then(() => {
          return res.send("user info updated");
        })
        .catch((err) => {
          console.log("updateProfile: User.findOneandUpdate Error", err);
          return res.status(400).send(err);
        });
    }
  },
  getUserPost: (req, res, next) => {
    let publicAddress;

    if (req.query.publicAddress == undefined) {
      publicAddress = res.locals.decoded.publicAddress;
    } else {
      publicAddress = req.query.publicAddress;
    }

    User.aggregate([
      { $match: { publicAddr: publicAddress } },
      {
        $lookup: {
          from: Post.collection.name,
          localField: "profile.post_ids",
          foreignField: "_id",
          as: "posts",
        },
      },
      {
        $project: {
          ownerOfNFT: 0,
          profile: 0,
          "posts.updatedAt": 0,
          "posts.user": 0,
        },
      },
    ])
      .then((user) => {
        if (!user) return res.status(400).send("user not found");
        console.log("user Post", user);
        return res.send(user);
      })
      .catch((err) => {
        console.log("getUerPost: User.aggregate error", err);
        return res.status(400).send(err);
      });
  },
  getUserComment: (req, res, next) => {
    const publicAddress = res.locals.decoded.publicAddress;

    User.aggregate([
      { $match: { publicAddr: publicAddress } },
      {
        $lookup: {
          from: Comment.collection.name,
          localField: "profile.comment_ids",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $project: {
          "comments._id": 1,
          "comments.caption": 1,
          "comments.updatedAt": 1,
        },
      },
    ])
      .then((result) => {
        if (!result) return res.status(400).send("user not found");
        return res.send(result[0]);
      })
      .catch((err) => {
        console.log("getUserComment: User.aggregate error", err);
        return res.status(400).send(err);
      });
  },
};
