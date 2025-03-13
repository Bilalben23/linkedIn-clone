import React from 'react';
import { useFetchProfile } from '../../hooks/useUserProfile';
import ProfileHeader from './ProfileHeader';
import AboutSection from './AboutSection';
import ActivitySection from './ActivitySection';
import SkillsSection from './SkillsSection';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';
import useAuth from '../../hooks/useAuth';

export default function ProfileDetails({ username }) {
    const { data, isLoading, isError, error } = useFetchProfile(username);
    const { authState: { user } } = useAuth();

    if (isError) {
        return (
            <div className="col-span-3 flex flex-col items-center justify-center py-4">
                <p className="text-sm text-red-500 text-center">
                    {error?.message || "Something went wrong while fetching the profile. Please try again later."}
                </p>
            </div>
        );
    }

    const isMyProfile = user._id === data?.data?.user?._id;

    return (
        <div className='col-span-3 flex flex-col gap-y-3 order-first md:order-none'>
            <ProfileHeader
                details={data?.data?.user}
                connectionsCount={data?.data?.connectionsCount}
                isMyProfile={isMyProfile}
                isLoading={isLoading}
            />
            <AboutSection
                aboutContent={data?.data?.user?.about}
                isMyProfile={isMyProfile}
                isLoading={isLoading}
            />
            <SkillsSection
                skills={data?.data?.user?.skills}
                isMyProfile={isMyProfile}
                isLoading={isLoading}
            />
            <ActivitySection />
            <EducationSection />
            <ExperienceSection />
        </div>
    );
}
