"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";

import { useEffect, useState } from 'react'
import { MembersModal } from "@/components/modals/membersModal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveServerModal } from "@/components/modals/leave-server";
import { DeleteServerModal } from "@/components/modals/delete-server";
import { DeleteChannelModal } from "@/components/modals/delete-channel";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { MessageFileModal } from "@/components/modals/MessageFileModal";
import { DeleteMessageModal } from "@/components/modals/delete-message";


export const ModalProvider = () => {

    const [isMouted, setIsMouted] = useState<Boolean>(false)

    useEffect(()=>{
        setIsMouted(true)
    },[])

    if(!isMouted){
      return null
    }
  return (
    <>
        <CreateServerModal />
        <InviteModal/>
        <EditServerModal/>
        <MembersModal/>
        <CreateChannelModal/>
        <LeaveServerModal />
        <DeleteServerModal/>
        <DeleteChannelModal/>
        <EditChannelModal/>
        <MessageFileModal/>
        <DeleteMessageModal/>
    </>
  )
}

