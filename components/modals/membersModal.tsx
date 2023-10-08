'use client';

import axios from "axios";
import qs from "query-string"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-model-store";
import {  Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';

import { ServerWithMembersWithProfiles } from '@/types';

import { ScrollArea } from '../ui/scroll-area';
import { UserAvatar } from '../UserAvatar';
import { useEffect, useState } from 'react';
import { MemberRole } from '@prisma/client';
import { useRouter } from "next/navigation";


const roleIconMap = {

  "GUEST":null,
  "MODERATOR":<ShieldCheck className='g-4 w-4 ml-2 text-indigo-500'/>,
  "ADMIN": <ShieldAlert  className="g-4 w-4 text-rose-500"/>,

}

export const MembersModal = () => {

  const {isOpen,onClose,type,data,onOpen} = useModal();
  const isModalOpen = isOpen && type === "members";
  const [ismounted,setIsmounted]=useState(false)
  const [loadingId ,setLoadingId ]= useState("")

  const router = useRouter()
  const { server } = data as { server: ServerWithMembersWithProfiles }

  const onRole =async (memberId:string,role:MemberRole) => {
    try {
      setLoadingId(memberId)
      const url  = qs.stringifyUrl({
        url:`/api/members/${memberId}`,
        query:{
          serverId:server?.id,
        }
      })
      const response = await axios.patch(url,{role})
      router.refresh()
      onOpen("members",{server:response.data})

    } catch (error) {
      console.log(error)
    }finally{
      setLoadingId('')
    }
  }
  const onKick =async (memberId:string) => {
    try {
      setLoadingId(memberId)
      const url  = qs.stringifyUrl({
        url:`/api/members/${memberId}`,
        query:{
          serverId:server?.id,
        }
      })
      const response = await axios.delete(url)
      router.refresh()
      onOpen("members",{server:response.data})

    } catch (error) {
      console.log(error)
    }finally{
      setLoadingId('')
    }
  }
  useEffect(()=>{
    setIsmounted(true)
  },[])

  if(!ismounted){
    return ""
  }
return (
    <Dialog open={isModalOpen} onOpenChange={onClose} >
            <DialogContent className='bg-white text-black overflow-hidden'>
             <DialogHeader className='pt-8 px-6'>
                  <DialogTitle className='text-2xl text-center'>
                      Manage Members
                  </DialogTitle>              
                  <DialogDescription className='text-center text-zinc-500'>
                      {server?.members?.length} Members
                  </DialogDescription>
             </DialogHeader>
             <ScrollArea className='mt-8 max-h-[430px] pr-6 '>
              {server?.members.map((member)=>(
                <div className="flex items-center gap-x-2 mb-6" key={member.id}>
                  <UserAvatar src={member.profile.imageUrl} className="" />
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center text-xs font-semibold gap-x-1">
                      {member.profile.name}
                      {roleIconMap[member.role]}
                    </div>
                    <p className='text-xs text-zinc-500'>
                      {member.profile.email}
                    </p>
                  </div>
                  {server.profileId !== member.profileId && loadingId !== member.id && (
                    <div className="ml-auto">
                              <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger
                          className="flex items-center"
                        >
                          <ShieldQuestion
                            className="w-4 h-4 mr-2"
                          />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                             onClick={()=>onRole(member.id,"GUEST")}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Guest
                              {member.role === "GUEST" && (
                                <Check
                                  className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={()=>onRole(member.id,"MODERATOR")}
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Moderator
                              {member.role === "MODERATOR" && (
                                <Check
                                  className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                       onClick={()=>onKick(member.id)}
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                    </div>
                  )}
                   {loadingId === member.id && (
                <Loader2
                  className="animate-spin text-zinc-500 ml-auto w-4 h-4"
                />
              )}
                </div>
              ))}
             </ScrollArea>
            </DialogContent>
    </Dialog>
  )
}

