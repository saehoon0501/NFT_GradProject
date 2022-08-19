const {Post} = require('../../models/post.model');
const User = require('../../models/user.model');
const mongoose = require("mongoose");
const multer = require("multer");
const path = require('path');

mongoose.connect('mongodb://localhost:27017/Postdb');


const upload = multer({
    storage: multer.diskStorage({
      // 저장할 장소
      destination(req, file, cb) {
        cb(null, 'public/uploads');
      },
      // 저장할 이미지의 파일명
      filename(req, file, cb) {
        const ext = path.extname(file.originalname); // 파일의 확장자
        console.log('file.originalname', file.originalname);
        // 파일명이 절대 겹치지 않도록 해줘야한다.
        // 파일이름 + 현재시간밀리초 + 파일확장자명
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
    }),
    // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한

  });

module.exports={
    returnURL : (req,res,next)=>{
       const IMG_URL = `http://localhost:4000/uploads/${req.file.filename}`
       console.log(IMG_URL);
       res.send(IMG_URL);
    },
    upload
    ,
    getPost : (req, res, next)=>{        

       const posts_result = Post.find().sort({createdAt:-1}).limit(10).skip(0).exec();
       
        posts_result.then(async (posts)=>{
            let results = [];

            await Promise.all(posts.map(async (post)=>{
                const result = await Post.findOne({_id:`${post.id}`})
                .populate('comments').populate('likes').populate('user', '', User).exec();
                results.push(result);
            }));
            
            return results;
       }).then(async (results)=>{

        await Promise.all(results.map(async (result)=>{
            
            const file = await gfs.files.findOne(result.imgs[0]);
            
            if(!file){
                return res.status(401).send('error file not found');
            }

            if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){                
                const base64 = await readImage(file)
                const sndData = {
                    post_id : result.id,
                    post_username: result.user.profile.username,
                    post_userProfile: result.user.profile.profile_pic,
                    post_liked: result.likes,
                    post_comments: result.comments,
                    base64};
                    return sndData 
                    }
                })).then((sndData)=>{
                    console.log('post data sent');
                    res.send(sndData);
            })
           
        })
    
    }
}

const readImage = (file) => {
    return new Promise(async (resolve, reject)=>{
        let buffer = [];
        const readStream = gridfsBucket.openDownloadStream(file._id);

        readStream.on('data', (chunk)=>{
            console.log('b');
            buffer.push(chunk);
        })

        readStream.on('end', ()=>{
            console.log('c');
            const fbuf = Buffer.concat(buffer);
            base64 = fbuf.toString('base64');  
            resolve(base64);
        })
    });
}

