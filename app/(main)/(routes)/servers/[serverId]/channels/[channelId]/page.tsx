import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatInput } from '@/components/chat/ChatInput'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

interface ChannelIdProps{
  params:{
    serverId:string,
    channelId:string
  }
}
const channelIdPage =  async({params}:ChannelIdProps) => {

  const profile = await currentProfile();

  if(!profile){
  return redirectToSignIn();
  }
  
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  })

  const member = await db.member.findFirst({
    where:{
      serverId: params.serverId,
      profileId: profile.id
    },
  })

  if(!channel || !member){
     redirect("/")
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full '>
     <ChatHeader serverId={channel.serverId} type='channel' name={channel.name}/>
 
        <ChatMessages
          member={member}
          name={channel.name}
          chatId={channel.id}
          type="channel"
          apiUrl='/api/messages'
          socketUrl='/api/socket/messages'
          socketQuery={
            {
              channelId:channel.id,
              serverId:channel.serverId
            }
          }
          paramKey='channelId'
          paramValue={channel.id}
        />
    
     <ChatInput 
        apiUrl="/api/socket/messages"
        query={{
          channelId:channel.id,
          serverId:channel.serverId
          }} 
        name={channel.name} 
        type='channel'  
     />
    </div>
  )
}

export default channelIdPage