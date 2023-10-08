
import {Server as NetServer} from 'http'
import { NextApiRequest } from 'next'
import {Server as ServerIO} from 'socket.io'
import { NextApiResponseServerIo } from '@/types'


export const config = {
 api:{
    bodyParser: false
 },
}

const ioHandler = (req:NextApiRequest,res:NextApiResponseServerIo) => {
    if(!res.socket.server.io){
        const path = '/api/socket/io';
        const httpserver:NetServer = res.socket.server as any;
        const io = new ServerIO(httpserver,{
            path:path,
            //@ts-ignore
            addTrailingSlash:false,
        })
        res.socket.server.io = io;
    }
}
export default ioHandler;