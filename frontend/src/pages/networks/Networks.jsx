import React from 'react'
import CommonFooter from '../../components/CommonFooter'
import Invitations from './Invitations'
import PeopleYouMayKnow from './PeopleYouMayKnow'
import { usePendingRequests } from '../../hooks/useConnections'
import { useSearchParams } from 'react-router-dom'

export default function Networks() {
    const [searchParams] = useSearchParams();
    const currentPage = +searchParams.get("page") || 1;

    const {
        data: invitations,
        isLoading,
        isError,
        error
    } = usePendingRequests(currentPage);

    return (
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-4'>
            <CommonFooter />

            <div className='col-span-3'>
                <Invitations
                    invitations={invitations}
                    isLoading={isLoading}
                    isError={isError}
                    currentPage={currentPage}
                    error={error}
                />
                <PeopleYouMayKnow />
            </div>

        </section>
    )
}
