import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 

export const ourFileRouter = {
  fileUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => { 
      const {getUser} = getKindeServerSession()
        const user=await getUser()

        if(!user || !user.id) throw new Error('Unauthorized')

      return{userId:user.id}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      const createrFile = await db.files.create({
        data:{
          key:file.key,
          name:file.name,
          userId:metadata.userId,
          url:`https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus:"PROCESSING"
        }
      })

    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;