import cloudinary from "../configs/cloudinary.mjs";

export const uploadImage = (file, folder, fileName) => {
    return new Promise((resolve, reject) => {

        if (!file.mimetype.startsWith("image/")) {
            return reject(new Error("Invalid file type. Only images are allowed."));
        }

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: fileName,
                overwrite: true
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error.message);
                    return reject(new Error(error));
                }
                resolve(result.public_id);
            }
        );
        stream.end(file.data);
    });
};
