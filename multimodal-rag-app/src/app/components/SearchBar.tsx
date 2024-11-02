"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, SearchSchema } from "@/schemas/searchSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { Upload } from "lucide-react";

const SearchComponent: React.FC = () => {
  const [response, setResponse] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "", image: undefined, limit: 10 },
  });

  const handleSearch = async (values: SearchSchema) => {
    const formData = new FormData();
    formData.append("image", values.image);
    formData.append("text", values.query);
    formData.append("limit", values.limit.toString());

    try {
      const res = await fetch("http://localhost:5000/search", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);

      const result = await res.json();
      setResponse(result);
    } catch (error) {
      console.error("Error during search request:", error);
      alert("There was an error processing your request.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue("image", file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSearch)}
        className="flex-grow self-end relative"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="hidden">Text Query</FormLabel>
              <FormMessage className="absolute right-2 text-sm" />
              <FormControl>
                <Input placeholder="Enter search query" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem className="absolute right-40 mt-4 w-20">
              <FormLabel className="hidden">Result Limit</FormLabel>
              {/* <FormMessage className="absolute bottom-0 text-sm" /> */}
              <FormControl>
                <Input
                  type="number"
                  placeholder="Limit (1-30)"
                  min={1}
                  max={30}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Dialog>
          <DialogTrigger asChild className="absolute right-20 mt-5">
            <Button type="button" variant="gooeyLeft">
              <ImageIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="hidden">Upload Image</DialogTitle>
            <DialogHeader>
              <FormLabel>Upload Image</FormLabel>
            </DialogHeader>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {imagePreview && (
              <div className="mt-4">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                onClick={() => form.setValue("image", imageFile as File)}
                variant="gooeyLeft"
              >
                <Upload />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          type="submit"
          variant="gooeyLeft"
          className="absolute mt-5 right-0"
        >
          <Search />
        </Button>
      </form>

      {response && (
        <div>
          <h3>Search Results:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </Form>
  );
};

export default SearchComponent;
