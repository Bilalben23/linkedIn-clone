import { useState } from "react";
import { Img } from "react-image";

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

const PostContent = ({ post }) => {
    const [expandedText, setExpandedText] = useState(false);

    return (
        <div className='mt-3'>
            {
                post.content && <div className='px-4'>
                    <p className='text-sm'>
                        {
                            expandedText ? post.content : post.content.slice(0, 200)
                        }
                        {
                            (post.content.length > 200 && !expandedText) && <span
                                className='hover:text-[#0A66C2] hover:underline cursor-pointer ml-1'
                                onClick={() => setExpandedText(true)}
                            >...more</span>
                        }
                    </p>
                </div>
            }
            {
                post.image && <div className='mt-1.5'>
                    <Img
                        src={`${CLOUDINARY_BASE_URL + post.image}`}
                        alt='post image'
                        loader={<div className="skeleton rounded-none w-full h-[350px] mt-3" />}
                        className="w-full"
                    />
                </div>
            }
        </div>
    );
};


export default PostContent;