import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import * as z from "zod";

const f = createUploadthing({
  errorFormatter: (err) => {
    return {
      message: err.message,
      zodError: err.cause instanceof z.ZodError ? err.cause.flatten() : null,
    };
  },
});
 
const handleAuth = () => {
  const userId  = auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId: userId };
}

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;