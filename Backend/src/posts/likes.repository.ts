interface ILikeRepository {
  getLike; // 좋아요를 id를 통해서 가져옴
  unLike; // 좋아요를 취소함
  createLike; // 좋아요 데이터를 생성
}

class MongoLikeRepository {}
