
import {useState} from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import image from "./images/image.png";
import image_after from "./images/image-after.png";
import docu_before from "./images/docu-before.png";
import docu_after from "./images/docu-after.png";
import poll from "./images/poll.png";

export const PostTab = () => {
    
    const [tabVal, setTabVal] = useState(0);

    const handleTapChange = (event, newVal) =>{
        setTabVal(newVal);
    }

    return(
        <Box sx={{width:'100%'}}>
            <Tabs
                sx={{'& .MuiTab-root':{
                        minHeight:'50px'
                    }, 
                    display:'flex',
                    border:'1px solid lightgray',
                    borderRadius:'5px',                   
                }}
                value = {tabVal}
                onChange={handleTapChange}
                aria-label = 'Tab for post style'
            >
            <Tab sx={{textTransform:'none', padding:'0', borderRight: '1px solid lightgray',fontWeight:'bold', zIndex:0}} 
            icon={tabVal==0?<img src={docu_after}/>:<img src={docu_before}/>} label='Post' iconPosition='start' />
            <Tab sx={{textTransform:'none', padding:'0', borderRight: '1px solid lightgray', fontWeight:'bold', zIndex:0}}
            icon={tabVal==1?<img src={image_after}/>:<img src={image}/>} label='Image' iconPosition='start' />
            <Tab sx={{textTransform:'none', padding:'0', borderRight: '1px solid lightgray',fontWeight:'bold', zIndex:0}}
            icon={<img src={poll} alt="poll_icon"/>} label='Poll' disabled iconPosition='start' />
            </Tabs>
        </Box>
    );
}