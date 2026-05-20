import imagekit from '../config/imagekit.js';


const upload=async (file)=>{
    try {
        const result=await imagekit.upload({
            file: file.buffer, 
            fileName:'file.jpg',
            folder: "/my_folder",
    useUniqueFileName: true
        })
        return result.url
        
    } catch (error) {
        console.log(error)
        
    }
}


export default upload;