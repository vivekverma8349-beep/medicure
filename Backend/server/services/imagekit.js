import imagekit from '../config/imagekit.js';


const upload = async (file) => {
    const result = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname || 'report',
        folder: '/medical_reports',
        useUniqueFileName: true,
    })
    return {
        url: result.url,
        name: result.name || file.originalname || 'report'
    }
}


export default upload;