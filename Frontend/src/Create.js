import { useState} from "react";
import React from "react";
import "./Create.css";
import CategoryList from "./CategoryList";
import { PostTab } from "./PostTab";
import { Header } from "./Header";

import emoji from './images/emoji.png';
import image from './images/image-s.png';
import gif from './images/gif2.png';

import {Box, TextField, Button} from "@mui/material";
  

export const Create = (props) => {

    return(
            <div class="create">
                <Header/>
                <div class="create_content">
                   <div class="create_title">
                    <span style={{fontSize:"1.4em"}}>Create a post</span> 
                   </div>
                   <div>                    
                        <CategoryList/>                    
                   </div>
                   <div style={{backgroundColor:'white', borderRadius:'3px'}}>
                        <div style={{width:'100%'}}>
                            <PostTab/>
                        </div>
                        <div>
                            <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '715px', margin:"5px 15px"},}}
                            noValidate autoComplete="off">
                            <div>
                            <TextField sx={{'& .MuiInputBase-input':{
                                height:'10px', borderRadius:'5px', backgroundColor:'white'
                            },
                            '& .MuiFormLabel-root':{                                
                                margin:'-5px 0px', border:'0'
                            }}} required id="Title" label="Title" variant='filled' defaultValue=""/>
                            </div>
                            </Box>
                            <div style={{margin:'10px 15px 0 15px', width:'715px', 
                            borderRadius:'3px 3px 0 0', backgroundColor:'#f3f3F3' }}>
                                
                            </div>
                            <div style={{padding:'0 15px'}}>
                                    <div contentEditable='true' data-ph='Text (optional)' style={{maxWidth: '500px',margin:'0px', padding:'5px', border:'1px solid lightgray',
                                     borderRadius:'5px', minHeight:'150px'}}>
                                    </div>
                                        <div style={{display:'flex', margin:'5px 0px'}}>
                                            <div style={{margin:'0 10px'}}>
                                             <img src={emoji} alt='emoji icon'/>
                                            </div>
                                            <div style={{margin:'0 10px'}}>
                                             <img src={image} alt='image icon'/>
                                            </div>
                                            <div style={{margin:'0 10px'}}>
                                             <img src={gif} alt='gif icon'/>
                                            </div>
                                            <div style={{margin:'0 10px 0px 520px'}}>
                                            <Button
                                                sx={{backgroundColor:'#26a7de', margin:'10px 0px', padding:'0 15px',color:'white'}}
                                                >
                                                완료
                                                </Button>
                                            </div>
                                    </div>
                            </div>                             
                        </div>
                   </div>
                </div>
            </div>
    )
}
