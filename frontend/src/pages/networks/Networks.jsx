import React from 'react'
import CommonFooter from '../../components/CommonFooter'
import Invitations from './Invitations'
import PeopleYouMayKnow from './PeopleYouMayKnow'

export default function Networks() {

    return (
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-4'>
            <CommonFooter />

            <div className='col-span-3 flex gap-y-3 flex-col'>
                <Invitations />
                <PeopleYouMayKnow />
            </div>

        </section>
    )
}
