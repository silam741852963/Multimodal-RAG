"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function Hero() {
  const carouselItems = [
    `<p>Discover beauty products effortlessly – use <strong>images or text</strong> to search Amazon’s vast selection!</p>`,
    `<p><strong>AI-driven search</strong> that lets you upload images or text descriptions for instant beauty product recommendations.</p>`,
    `<p>Explore personalized beauty results with <em><i><a href="https://huggingface.co/BAAI/bge-base-en-v1.5">FlagEmbedding</a></i></em>, enabling multimedia search for Amazon beauty products.</p>`,
    `<p>Can’t find the right words? <strong>Upload a picture</strong>! Our platform understands images to match your style.</p>`,
    `<p>Say goodbye to endless scrolling! <strong>Find exactly what you need</strong> with smart, image and text-based search.</p>`,
  ];

  return (
    <section>
      <h2 className="text-4xl tracking-widest flex items-center gap-10">
        <p>Effortless</p>
        <Button variant="shine" className="h-fit w-fit text-4xl flex p-5">
          <Link href="/search">
            <span className="font-beauty-demo text-6xl underline">Beauty</span>{" "}
            <p>Search</p>
          </Link>
        </Button>
        <p>on Amazon</p>
      </h2>
      <hr className="mt-10 w-40" />
      <Carousel
        className="w-full max-w-lg" // Extend carousel width
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
      >
        <CarouselContent className="w-full">
          {carouselItems.map((content, index) => (
            <CarouselItem key={index} className="min-w-full">
              <div className="">
                <Card className="border-none shadow-none">
                  <CardContent
                    className="flex aspect-video items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
