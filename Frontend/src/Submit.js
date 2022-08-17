import {useRef, useState, useMemo} from 'react';
import { Box,Button,Switch} from '@mui/material';
import './Submit.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

// import emoji from './images/emoji.png';
// import image_s from './images/image-s.png';
// import gif from './images/gif2.png';  

const maxSize = 30 * 1000 * 1000

const token = window.localStorage.getItem("NFTLogin");
const baseURL = "http://localhost:4000";

const uploadURL = (file) => {
    return new Promise((resolve, reject) => {
        const data = new FormData();

        data.append('file', file);

        const result = axios.post(`${baseURL}/api/uploads`,data,{
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        });
        if(result)
            resolve(result);
        else
            reject(new Error('failed to get Image URL'));
    });
};

export const Submit = (props)=>{

    const [open, setOpen] = useState([{
        'name':'sumit_open',
        isActive: false
    },
    {
        'name':'post_switch',
        isActive: false   
    },
    {
        'name':'emoji_button',
        isActive: false   
    }]);    
    const [title, setTitle] = useState('');
    const [selectedImage, setImage] = useState(null);
    const quill = useRef(null);

    const qull_modules = useMemo(()=>{
        return{
            toolbar: {
            container : [[{'size':[false,'large']},'bold', 'italic', 'underline', 'strike'],
            ['blockquote',{'list':'ordered'},{'list':'bullet'},{'align':[]},{'color':[]}],['link','image']],
            handlers :{
                'image': ()=>{
                    
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();
    
                    input.onchange = async ()=>{
                        const file = input.files[0];
                        console.log(file.size);
                        if(file.size > maxSize) {alert('최대 크기 30MB만 가능');    return }
                        const editor = quill.current.getEditor();
                        const range = editor.getSelection();                        
                        
                        const url = await uploadURL(file);

                        editor.insertEmbed(range.index, 'block', `<p><br></p>`);                        
                        editor.insertEmbed(range.index, 'image', `${url.data}`);   
                    }
                }
            }
        }};
    },[]);        

    const handleClick = (event) => {
        let index = event.target.getAttribute('data-index');        
        if(index==null) index= 1;
        const newState = [...open];        
        newState[index].isActive = !newState[index].isActive        
        setOpen(newState);
    }

    const handleImage = () =>{
        setImage(null);
    }

    const handleSubmit = async () => {
        
        const post_title = title
        const post_text = quill.current.getEditor().getContents();
        const post_user = props.user_info.profile;
        
        await axios.post(`${baseURL}/api/post`,{post_title,post_text,post_user}
            ,{
                headers: {                    
                    Authorization: `Bearer ${token}`,
            }
        }).then((res)=>{
            console.log(res.data);
            props.setPosts([{
                            post_id: res.data.post_id,
                            username:res.data.post_username,
                            caption: res.data.post_text,
                            userPic: res.data.post_userPic,
                            title: res.data.post_title,
                            likes:res.data.post_liked,
                            comments:res.data.post_comments}])
        });

        
    } 
    

    return(
            <Box>                   
            <div className={open[1].isActive?'submit_wrapper2':'submit_wrapper'}>
            {(open[0].isActive&&open[1].isActive)?
                <div>
                    <div style={{borderColor:"black", marginTop:"10px",width:"100%", height:"30px", 
                        borderBottom: "solid 1px lightgray", alignItems:"center", justifyContent:"center"}}>
                        {selectedImage==null?<h3 >이미지 추가</h3>:<div><span style={{marginRight:"10px"}} class="close" 
                        onClick={handleImage}>&times;</span>
                        <h3 style={{marginLeft:'30px'}}>이미지 추가</h3></div>}                        
                    </div>                               
                {selectedImage==null?<div>
                    <input                                                
                        type="file"
                        accept='.jpg, .png'
                        class="modal-input"
                        onChange={(event)=>{
                            setImage(event.target.files[0]);
                        }}
                    />
                </div>
                :
                <div className='submit_insta'>                                                                                  
                    <img src={`${URL.createObjectURL(selectedImage)}`} alt="selectedImage"/>                                                                
                </div>
                }
                     </div>
                    :<div></div>
                    }
                    <div className={open[1].isActive?'submit_header2':'submit_header'}>
                        <div className='submit_profilePic'>
                            <img 
                                src={props.pic}
                                alt="profile picture"
                                style={{width:"45px", height:"45px", borderRadius:"10px"}}
                                />                            
                        </div>                    
                        <div onBlur={e=>{setTitle(e.currentTarget.textContent);}} 
                        onClick={open[0].isActive?undefined:handleClick} contentEditable='true' 
                        data-ph={open[0].isActive?open[1].isActive?'Text (optional)'
                        :'Title':'게시물 작성'} data-index='0'
                            className='submit_title'>
                        </div>                                            
                    </div>
                
               <div>
                {(open[0].isActive&&!open[1].isActive)?
                <div style={{marginTop:'5px'}}>
                    <ReactQuill ref={quill} modules={qull_modules} placeholder={'Text (Optional)'} theme='snow'/>
                <div style={{display:'flex', margin:'5px 0px'}}>
                    
                    </div>
                    </div>
                    :<div></div>                    
                    }                      
                    <div className={open[0].isActive?'submit_switch2':'submit_switch'}>
                    {/* 스타일                     */}
                    {/* <Switch onChange={handleClick} data-index='1'/> */}
                    <Button onClick={handleClick} data-index='0'
                        sx={{backgroundColor:'lightgray', margin:'10px 10px', padding:'0 15px',color:'white'}}
                        >
                        취소
                        </Button>
                    <Button
                        onClick={handleSubmit}
                        sx={{backgroundColor:'#26a7de', margin:'10px 0px', padding:'0 15px',color:'white'}}
                        >
                        완료
                        </Button>
                    </div>
                </div>
                </div>                                                                
                </Box>         
    );
}