"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generatePost, savePost } from "@/actions/generate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Copy, Save, Loader2 } from "lucide-react";
import { generatePostSchema, GeneratePostValues } from "@/lib/schemas";
import { toast } from "sonner";

interface GenerateFormProps {
    credits: number;
}

export function GenerateForm({ credits }: GenerateFormProps) {
    const [variations, setVariations] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const form = useForm<GeneratePostValues>({
        resolver: zodResolver(generatePostSchema),
        defaultValues: {
            topic: "",
            tone: "professional",
        },
    });

    const onSubmit = (data: GeneratePostValues) => {
        if (credits <= 0) {
            toast.error("No credits remaining. Please upgrade.");
            return;
        }

        startTransition(async () => {
            try {
                const results = await generatePost(data.topic, data.tone);
                setVariations(results);
                toast.success("Posts generated successfully!");
            } catch (error) {
                toast.error("Error generating post. Please try again.");
            }
        });
    };

    const handleSave = async (content: string) => {
        const { topic, tone } = form.getValues();
        try {
            await savePost(content, topic, tone);
            toast.success("Saved to history!");
        } catch (e) {
            toast.error("Failed to save post.");
        }
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Topic or Achievement</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g. I just launched a new website for a client and increased their conversions by 20%..."
                                            className="min-h-[150px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tone</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a tone" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="professional">Professional</SelectItem>
                                            <SelectItem value="casual">Casual (Storytelling)</SelectItem>
                                            <SelectItem value="controversial">Hot Take</SelectItem>
                                            <SelectItem value="educational">Educational</SelectItem>
                                            <SelectItem value="humorous">Humorous</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isPending || credits <= 0}
                            className="w-full"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : credits <= 0 ? (
                                "No Credits Remaining - Upgrade to Pro"
                            ) : (
                                "Generate Posts"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Results</h3>
                {variations.length === 0 ? (
                    <div className="text-muted-foreground text-sm border-dashed border-2 rounded-lg p-8 text-center flex flex-col items-center justify-center h-[300px]">
                        <p>Generated posts will appear here.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {variations.map((post, i) => (
                            <Card key={i}>
                                <CardContent className="pt-6 whitespace-pre-wrap text-sm">
                                    {post}
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                                    <Button size="sm" variant="ghost" onClick={() => handleCopy(post)}>
                                        <Copy className="h-4 w-4 mr-2" /> Copy
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleSave(post)}>
                                        <Save className="h-4 w-4 mr-2" /> Save
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
