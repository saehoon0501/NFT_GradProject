import "./Profile.css"
import img from "./images/user.png";


export const Profile = () => {
    return(
        <div className="app">
            <div className="profile-container">
                <div className="profile-content">
                    <div className="profile-wrapper">
                        <div className="profile-info">
                        <img src={img} style={{width:"450px", borderRadius:"20px"}}/>
                        </div>
                        <div className="profile-info profile-about" style={{ width:"400px",padding:"1% 5%"}}>
                            <div>
                                <h2>byun_0501</h2>
                            </div>
                            <div className="profile-text">
                                <h3>게시물 3</h3>
                                <h3 style={{color:"blue"}}>RGB 100</h3>
                            </div>
                            <div>
                               
                            </div>
                            <div>
                                <span>
                                    안녕하세요~
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-wrapper">
                    <div style={{width:"100%", height:"1px", borderBottom: "1px solid lightgray", margin:"3% auto"}}>
                        <div className="profile-post">
                            <h4>
                                게시물
                            </h4>
                        </div>
                        <div className="profile-post">
                            <img src={img} style={{width:"30%"}}/>
                            <img src={img} style={{width:"30%"}}/>
                            <img src={img} style={{width:"30%"}}/>
                        </div>
                    </div>                    
                </div>                
            </div>
            
        </div>
    );
}