
# 🎤 프로젝트 소개
## NFT기반 커뮤니티 서비스 제작
<center>
<img src="Frontend/src/assets/project.jpg" width="600px" height="300px" title="px(픽셀) 크기 설정" alt="ProjectImage"></img></center>

많은 NFT 프로젝트들이 자신들만의 문화와 세계관을 만들어 사람들에게 소속감을 부여하지만 대부분 디스코드 채널에 참여하여 소통한다. 이러한 그룹 내 소속감과 활동을 더 증진시키 위해 이들만이 사용가능한 커뮤니티를 웹앱을 제작한다.

## 컴포넌트 다이어그램
<center>
<img src="Frontend/src/assets/system design.png" width="500px" height="300px" title="px(픽셀) 크기 설정" alt="ProjectImage"></img></center><br/>

# 💫 핵심 기능
1. ### NFT를 커뮤니티 사이트의 유저 계정 및 프로필로 활용해  기존 로그인 방식을 대체하고 기본적인 커뮤니티 활동을 가능하게 한다.
<center>
<img src="Frontend/src/assets/LoginScreen.png" width="400px" height="300px" title="px(픽셀) 크기 설정" alt="LoginScreen"></img></center>
<center>로그인 화면</center>
<br/>
<center>
<img src="Frontend/src/assets/mainPage.png" width="500px" height="200px" title="px(픽셀) 크기 설정" alt="mainPage"></img>
메인 페이지
</center><br/>

2. ### NFT를 활용해 웹사이트 광고판을 만들어 자신이 원하는 사이트를 이미지,URL을 설정하여 광고한다.

<center><img src="Frontend/public/wholeSquare.png" width="500px" height="400px" title="px(픽셀) 크기 설정" alt="billboard"></img></center>
<center>광고판 모습</center>  
<br/>
<center>  
<img src="Frontend/src/assets/billboard_info.png" width="250px" height="200px" title="px(픽셀) 크기 설정" alt="billboardInfo"></img>
광고판 칸에 대한 정보(이미지,URL,설명으로 구성)</center>
<br/>

# 🛠️ 사용 기술
- React
- NodeJS
- MongoDB
- Solidity
- Ganache & Truffle  
<br/>

# ❗️ 프로젝트 실행 방법
- 프롬프트 상 Frontend 파일에 접근해 npm start 입력
- 프롬프트 상 backend 파일에 접근해 nodemon index.js 입력
- backend 파일에 config.js 파일을 만들어 MongoDB atlas 주소를 mongoPath로 module export 한다.
- Truffle로 블록체인 테스트 넷을 실행
- 스마트 컨트랙트를 배포한 후 그 주소를 config.js 파일에 contractAddress로 module export 한다.

관련 문서 링크
https://drive.google.com/file/d/1qUERhKRbPYl1O5SeLJB4Qu8j4dQpGnVf/view?usp=share_link