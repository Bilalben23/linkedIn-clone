import { Link } from "react-router-dom";

export default function CommonFooter() {

    return (
        <div className='md:sticky hidden md:block md:top-18'>
            <div>
                <img src="/assets/hiring_thumbnail.png" alt="Hiring Thumbnail" className='w-full rounded-box object-cover' />
            </div>
            <div className='flex flex-wrap gap-x-3 gap-y-1 font-extralight mt-3 text-[12px] px-6 text-black/60'>
                {["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising", "Business Services", "Get the LinkedIn app", "More"].map((text, idx) => (
                    <Link key={idx} to="#" className='link-hover'>{text}</Link>
                ))}
            </div>
            <div className='flex items-center gap-x-1 mt-2 px-3'>
                <img src="/assets/logo.svg" alt="logo" className='w-14' />
                <p className='text-[12px] font-light'> LinkedIn Corporation © 2025</p>
            </div>
        </div>
    )
};
