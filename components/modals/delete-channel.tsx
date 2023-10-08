'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import { useModal } from "@/hooks/use-model-store";
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import qs from "query-string"
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';


export const DeleteChannelModal = () => {

  const {isOpen,onClose,type,data,onOpen} = useModal();
  const isModalOpen = isOpen && type === "deleteChannel";
  const router = useRouter()

  const { server,channel } = data

  const [isLoading ,setIsLoading] = useState(false)
  

  const onClick = async() => {
      try {
        setIsLoading(true)
        const url = qs.stringifyUrl({
          url:`/api/channels/${channel?.id}`,
          query:{
            serverId :server?.id
          }
        })
        await axios.delete(url)

        onClose();
        router.refresh()
        router.push(`/servers/${server?.id}`)

      } catch (error) {
        console.log(error)
      }finally{
        setIsLoading(false)
      }
  }

return (
    <Dialog open={isModalOpen} onOpenChange={onClose} >
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
             <DialogHeader className='pt-8 px-6'>
                  <DialogTitle className='text-2xl text-center'>
                        Delete Channel
                  </DialogTitle> 
                  <DialogDescription className='text-center text-zinc-500'>
                    Are you sure you want to do this ?
                    <span className='font-semibold text-indigo-500'> #{channel?.name} Will be permanently delted</span> 
                  </DialogDescription>             
             </DialogHeader>
              <div className="p-6">
                <DialogFooter className="bg-gray-100 px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                      <Button
                        disabled={isLoading}
                        onClick={onClose}
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={isLoading}
                        variant="primary"
                        onClick={onClick}
                      >
                        Confirm
                      </Button>
                  </div>
                </DialogFooter>
              </div>
            </DialogContent>
    </Dialog>
  )
}

