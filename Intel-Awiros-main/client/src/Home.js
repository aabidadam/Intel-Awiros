import { useState } from 'react';
import classes from './Home.module.css';
import image from './undraw_workout_gcgu.svg';
import axios from 'axios';
const Home = () => {
    const [loading,setLoading]=useState(false);
    const [res,setRes]=useState(null);
    const [file,setFile]=useState(null);
    const [sports,setSports]=useState("select");
    const clipFileName = (fileName, maxLength) => {
        if (fileName.length <= maxLength) {
            return fileName;
        } else {
            const clippedName = `${fileName.slice(0, maxLength / 2)}....${fileName.slice(-maxLength / 2)}`;
            return clippedName;
        }
    }
    const handleSubmit=()=>{
        if(sports==="select"){
            alert('Please select a sport');
            return;
        }
        if(!file){
            alert('Please select a image');
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        formData.append('sports', sports);
        // console.log(formData);
        setLoading(true)
        axios.post('http://localhost:5000/',formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(res=>{
                setRes(res.data)
                setLoading(false)
            })
            .then(()=>console.log(res))
            .catch(err=>console.log(err));
    }
    // useEffect(() => {
    //     console.log(file);
    //     console.log(sports);
    // }, [sports,file]);
    return ( 
        <div className={classes.home}>
            <div className={classes.info}>
                <div className={classes.content}>
                    <p>Correct your</p>
                    <p style={{fontFamily:"Rowdies"}}>Posture</p> 
                </div>
            </div>
            <img src={image} alt="workout" />
            <div className={classes.right}>
                <div className={classes.contentDetail}>
                    <div className={classes.selectSports}>
                        <label htmlFor="sports">Choose a Sport:</label>
                        <select name="sports" id="sports" value={sports} onChange={(e)=>setSports(e.target.value)}>
                            {sports === "select" && <option value="select">Select</option>}
                            <option value="cricket">Cricket</option>
                            {/* <option value="yoga">Yoga</option> */}
                        </select>
                    </div>
                    <div className={classes.upload}>
                        <label htmlFor="file">Upload video</label>
                        <div className={classes.selectFile}>
                            <input type='file' accept='image/*' capture='camera' id='file' onChange={(e)=>setFile(e.target.files[0])}/>
                            <div className={classes.select}>
                                {!file?<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
                                    <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z"/>
                                </svg>:<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-play-fill" viewBox="0 0 16 16">
                                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6 6.883a.5.5 0 0 1 .757-.429l3.528 2.117a.5.5 0 0 1 0 .858l-3.528 2.117a.5.5 0 0 1-.757-.43V6.884z"/>
                                </svg>}
                                <p>{file&&file.name?clipFileName(file.name, 10):window.innerWidth>950?`Choose a file`:`Upload`}</p>
                            </div>
                        </div>
                    </div>  
                    {res&&<div>{`Your correctness measure: ${res.mlResponse}%`}</div>}
                    {loading?<button disabled>Loading...</button>:<button onClick={handleSubmit}>Process Video</button>}
                    
                </div>
            </div>
        </div>
     );
}
 
export default Home;