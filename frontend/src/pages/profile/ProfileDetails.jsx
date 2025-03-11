import React from 'react';
import { useFetchProfile } from '../../hooks/useUserProfile';
import ProfileHeader from './ProfileHeader';
import AboutSection from './AboutSection';
import ActivitySection from './ActivitySection';
import SkillsSection from './SkillsSection';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';

export default function ProfileDetails({ username }) {
    const { data, isLoading, isError, error } = useFetchProfile(username);

    console.log(data);


    return (
        <div className='col-span-3 flex flex-col gap-y-3'>
            <ProfileHeader details={data?.data} isLoading={isLoading} />
            <AboutSection aboutContent={data?.data?.about} isLoading={isLoading} />
            <ActivitySection />
            <SkillsSection />
            <EducationSection />
            <ExperienceSection />
        </div>
    );
}
