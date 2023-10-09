import { createNextRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
 
const handler = createNextRouteHandler({
  router: ourFileRouter,
});
 
export default handler;