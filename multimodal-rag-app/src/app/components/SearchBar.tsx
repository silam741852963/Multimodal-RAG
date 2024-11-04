"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, SearchSchema } from "@/schemas/searchSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Search, ImageIcon, Upload } from "lucide-react";
import { useSearchContext } from "@/components/context/SearchContext";
import ErrorMessages from "./ErrorMessages";

const SearchBar: React.FC = () => {
  const { setSearchData, setResponse } = useSearchContext();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "", limit: 10 },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  // Collect all errors for universal display
  const errorMessages = [
    errors.query?.message,
    errors.limit?.message,
    errors.image?.message,
  ].filter(Boolean) as string[];

  useEffect(() => {
    // Reset the form with default values if needed
    reset();
  }, [reset]);

  const handleSearch = async (values: SearchSchema) => {
    const formData = new FormData();
    if (values.image) {
      formData.append("image", values.image);
    }
    formData.append("text", values.query);
    formData.append("limit", values.limit.toString());

    try {
      const res = await fetch("http://localhost:5000/search", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);

      const result = await res.json();
      setResponse(result); // Update response in context
      setSearchData(values); // Persist search parameters for context use
    } catch (error) {
      console.error("Error during search request:", error);
      alert("There was an error processing your request.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file); // Update form state for image
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const confirmUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setDialogOpen(false); // Close dialog after upload
    }, 1000);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleSearch)}
        className="flex-grow self-end relative"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="hidden">Text Query</FormLabel>
              {/* <FormMessage className="absolute right-2 text-sm" /> */}
              <FormControl>
                <Input placeholder="Enter search query" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <section className="flex absolute mt-10 h-10 justify-between items-end w-full">
          <ErrorMessages errors={errorMessages} />
          <section className="flex gap-10">
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="hidden">Result Limit</FormLabel>
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

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="gooeyLeft"
                  onClick={() => setDialogOpen(true)}
                >
                  <ImageIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Upload Image</DialogTitle>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <Image
                      src={imagePreview}
                      alt="Image Preview"
                      width={200}
                      height={200}
                      className="rounded-md mx-auto"
                    />
                  </div>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={confirmUpload}
                    variant="gooeyLeft"
                    disabled={isUploading}
                    className="w-full"
                  >
                    {isUploading ? "Uploading..." : <Upload />}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button type="submit" variant="gooeyLeft">
              <Search />
            </Button>
          </section>
        </section>
      </form>
    </Form>
  );
};

export default SearchBar;
