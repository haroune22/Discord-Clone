'use client'

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import  { FileUpload } from "../file-upload";
import axios from "axios"
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Server name is required."
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required."
  })
})

export const MessageFileModal = () => {


  const router = useRouter()
  const {isOpen,onClose,type,data} = useModal()

  const isModalOpen = isOpen && type === 'messageFile';
  
  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:"",
      imageUrl:"",
    }
  })

  const isLoading = form.formState.isSubmitting;

  const handleClose  = () => {
    form.reset();
    onClose();
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) =>{
    
    try {
      
      await axios.post('/api/servers',values)

      form.reset()
      router.refresh()
      window.location.reload()

    } catch (error) {
      console.log(error)
    }
  }

  
return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
             <DialogHeader className='pt-8 px-6'>
                  <DialogTitle className='text-2xl text-center'>
                      Customize your server
                  </DialogTitle>
                  <DialogDescription className='text-center text-zinc-600'>
                    Give your server a personality with a name and an image. You can always change it later
                  </DialogDescription>
             </DialogHeader>
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8 px-6">
                           <div className="flex items-center justify-center text-center">
                            <FormField  control={form.control}
                            name="imageUrl"
                            render={({field})=>(
                              <FormItem>
                                <FormControl>
                                  <FileUpload endpoint="serverImage"  value={field.value} onChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )} />

                           </div>
                           <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                              <FormLabel className="uppercase text-base font-bold text-zinc-500 dark:text-secondary/70">
                                Server name
                              </FormLabel>
                              <FormControl>
                                <Input 
                                disabled={isLoading} 
                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-within:ring-offset-0 " 
                                placeholder="Enter Server name"
                                {...field}/>
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                           )} />
                </div>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                      <Button variant="primary" disabled={isLoading} >
                        Create
                      </Button>
                </DialogFooter>
              </form>
             </Form>
            </DialogContent>
    </Dialog>
  )
}
