import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server"


const MESSAGES_BACTH = 10;

export async function GET (req:Request){

    try {
        
        const profile = await currentProfile();

        const  { searchParams } = new URL(req.url)
        const cursor =  searchParams.get("cursor")
        const channelId = searchParams.get('channelId')

        if(!profile){
            return new NextResponse("unothorized", { status:401})
        }
        if(!channelId){
            return new NextResponse("channelId is missing", { status:400})
        }


        let messages:Message[] = [] 
        
        if(cursor){
            messages = await db.message.findMany({
                take:MESSAGES_BACTH,
                skip:1,
                cursor:{
                    id:cursor,
                },
                where:{
                    channelId,
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        } else {
            messages = await db.message.findMany({
                take:MESSAGES_BACTH,
                where:{
                    channelId,
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        }

        let nextCursor = null;
        if(messages.length === MESSAGES_BACTH){
            nextCursor = messages[MESSAGES_BACTH - 1].id
        }


        return NextResponse.json({
            items:messages,
            nextCursor
        })

    } catch (error) {
        console.log('[MESSAGES_GET]', error)
        return new NextResponse("Internal Error", { status:500})
    }
}