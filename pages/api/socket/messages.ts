import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";

import { NextApiRequest } from "next";

export default async function handler (req:NextApiRequest,res:NextApiResponseServerIo) {

    if(req.method !== "POST") {
        return res.status(405).json({error:"Methode Not Allowed"})
    };

    try {
        const profile = await currentProfilePages(req)
        const { content,fileUrl}=  await req.body;
        const { serverId,channelId} =await   req.query;

        if(!profile){
            return res.status(401).json("Profile Not Found")
        }
    
        if(!serverId){
            return res.status(400).json("Server id is required")
        }

        if(!channelId){
            return res.status(402).json("Channel id is required")
        }

        if(!content){
            return res.status(403).json("Content is Missing")
        }
        

        const server = await db.server.findUnique({
        where:{
            id: serverId as string,
            members:{
                some:{
                    profileId:profile.id
                }
            }
        },
        include:{
            members:true
        }
        })

        if(!server){
            return res.status(404).json("server not found")
        }
        
        const channel = await db.channel.findFirst({
            where:{
                id:channelId as string,
                serverId: serverId as string
            }
        })

        if(!channel){
            return res.status(404).json("channel not found")
        }

        const member = server.members.find((member) => member.profileId === profile.id);

        if(!member){
            return res.status(404).json("Member Not found")
        }

        const  message = await db.message.create({
            data:{
                content,
                fileUrl,
                channelId:channelId as string,
                memberId:member.id as string
            },
            include : {
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })

        const ChannelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(ChannelKey,message);
        
        return res.status(200).json({message,channelId})

    } catch (error) {
        console.log("MESSAGES_POST",error)
        return res.status(500).json("Internal Error")
    }
}