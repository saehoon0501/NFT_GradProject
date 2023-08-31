interface ICommentRepository {
  getCommentById; // comment를 id를 통해서 가져옴
  addReply; // comment 데이터에 reply를 추가하는 comment를 생성
  updateComment; // comment 데이터를 생성하고 이를 Post와 User에 추가한다.
  deleteComment; // comment 데이터를 삭제하고 관련된 User와 Post에 반영
  deleteReply; // comment 데이터를 삭제하고 관련된 comment에 반영
}

class MongoCommentRepository {}
