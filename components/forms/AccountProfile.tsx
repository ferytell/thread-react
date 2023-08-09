"use client"
import { UserValidation } from '@/lib/validation/user';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { ChangeEvent } from 'react';

interface Props {
    user: {
        id: string, 
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string,
    };
    btnTitle: string;
}

const AccountProfile = ( { user, btnTitle }: Props ) => {
    const form = useForm({ 
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: '',
            name: '',
            username: '',
            bio: ''
        }
    });


    const handleImage = (e: ChangeEvent, fieldChange: (value: string) => void) => {
        e.preventDefault();
    }
    function onSubmit(values: z.infer<typeof UserValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                    <FormItem className='flex item-center gap-4'>
                    <FormLabel className='account-form_image-label'>
                        {field.value? (
                            <Image 
                                src={field.value}
                                alt="profile photo"
                                width={96}
                                height={96}
                                priority 
                                className="rounded-full object-contain"
                            />
                        ) : (
                            <Image
                                src="/asset/profile.svg"
                                alt="profile photo"
                                width={96}
                                height={96}
                                className="object-contain"    
                                
                            />
                        )}
                        
                    </FormLabel>
                    <FormControl className="flex-1 text-base-semibold text-gray-200">
                        <Input 
                            type="file"
                            accept="image/*"
                            placeholder="Upload a photo"
                            className="account-form_image-input"
                            onChange={(e) => handleImage(e, field.onChange)} />
                    </FormControl>
                    </FormItem>
                )}
                />
                <Button type="submit">Submit</Button>
            </form>
         </Form>
    )
}

export default AccountProfile;