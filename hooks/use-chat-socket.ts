"use client"
import { useSocket } from "@/components/providers/SocketProvider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps  = {
    addKey:string;
    updateKey:string;
    queryKey:string;
}

type MessageWithMemberWithProfile = Message & {
    member:Member & {
        profile: Profile
    }
}

export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();
  
    useEffect(() => {
      if (!socket) {
        return;
      }
  
      socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }
  
          const newData = oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) =>
              item.id === message.id ? message : item
            ),
          }));
  
          return {
            ...oldData,
            pages: newData,
          };
        });
      });
      socket.on(addKey,(message:MessageWithMemberWithProfile)=>{
        queryClient.setQueryData([queryKey], (oldData:any)=> {
            if(!oldData || !oldData.pages || oldData.pages.length === 0) {
                return { 
                    pages:[{
                        items:[message]
                    }]
                }
            }
            const newData = [...oldData.pages];
            newData[0]={
                ...newData,
                items:[
                    message,
                    ...newData[0].items
                ]
            };
            return {
                ...oldData,
                pages:newData
            }
        })
      })
      return () => {
        socket.off(addKey);
        socket.off(updateKey);
      }
    }, [,addKey, socket, queryClient, updateKey, queryKey]);
  };