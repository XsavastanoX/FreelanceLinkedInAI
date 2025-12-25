"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfile } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { userProfileSchema, UserProfileValues } from "@/lib/schemas";
import { toast } from "sonner";

interface ProfileFormProps {
    initialNiche?: string | null;
    initialExpertise?: string | null;
}

export function ProfileForm({ initialNiche, initialExpertise }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<UserProfileValues>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            niche: initialNiche || "",
            expertise: initialExpertise || "",
        },
    });

    const onSubmit = (data: UserProfileValues) => {
        startTransition(async () => {
            try {
                await updateUserProfile(data);
                toast.success("Profile updated!");
            } catch (error) {
                toast.error("Failed to update profile.");
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>
                            Customize your AI generation preferences.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="niche"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Niche</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Web Development, Shopify, React Native"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What field do you work in?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expertise"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expertise / Focus</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Frontend Performance, E-commerce CRO, UI Design"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What topics do you want to highlight?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}

function FormDescription({ children }: { children: React.ReactNode }) {
    return <p className="text-sm text-muted-foreground">{children}</p>;
}
