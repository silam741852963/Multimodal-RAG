"use client";

import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface SearchResultItemProps {
  item: Product;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item }) => {
  const images = item.images_large?.Data?.StringData?.data || [];
  const reviewsText = item.reviews_text?.Data?.StringData?.data || [];
  const dynamicBasis = `basis-1/${Math.min(images.length, 3) || 1}`; // Limit to 3 items per row for better readability

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card className="w-[35rem] h-[30rem] p-4 rounded-md cursor-pointer">
          <CardHeader>
            <CardTitle className="font-semibold text-center">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            {/* Image Carousel */}
            <div className="w-1/2">
              {images.length ? (
                <Carousel
                  plugins={[
                    Autoplay({
                      delay: 4000,
                    }),
                  ]}
                >
                  <CarouselContent className="flex">
                    {images.map((imageUrl, idx) => (
                      <CarouselItem
                        key={idx}
                        className={`flex justify-center items-center`}
                      >
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          width={200}
                          height={200}
                          className="rounded-md"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              ) : (
                <p className="text-center text-sm">No image available</p>
              )}
            </div>

            {/* Item Details */}
            <div className="w-1/2 text-right px-4">
              <p className="">
                Rating: {item.average_rating} ({item.rating_number} reviews)
              </p>
              <p className="">Store: {item.store}</p>
              <p className="mt-1">Distance: {item.distance}</p>
            </div>
          </CardContent>
        </Card>
      </DrawerTrigger>

      {/* Drawer Content */}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{item.title}</DrawerTitle>
          <DrawerDescription>Complete product details</DrawerDescription>
        </DrawerHeader>
        <div className="p-5 text-sm flex flex-col">
          <section className="flex w-full justify-between">
            <section>
              <p>
                <strong>Description:</strong>{" "}
                {item.description?.Data?.StringData?.data?.[0] ||
                  "No description available"}
              </p>
              <p>
                <strong>Distance:</strong> {item.distance}
              </p>
              <p>
                <strong>Category:</strong> {item.main_category}
              </p>
              <p>
                <strong>Parent ASIN:</strong> {item.parent_asin}
              </p>
              <p>
                <strong>Store:</strong> {item.store}
              </p>
            </section>

            {/* Image Carousel in Drawer */}
            <div className="w-1/2">
              {images.length ? (
                <Carousel
                  plugins={[
                    Autoplay({
                      delay: 4000,
                    }),
                  ]}
                >
                  <CarouselContent className="flex">
                    {images.map((imageUrl, idx) => (
                      <CarouselItem
                        key={idx}
                        className={`flex justify-center items-center ${dynamicBasis}`}
                      >
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          width={200}
                          height={200}
                          className="rounded-md"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              ) : (
                <p className="text-center text-sm">No image available</p>
              )}
            </div>
          </section>

          {/* Reviews Carousel */}
          {reviewsText.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold">Reviews:</p>
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 5000,
                  }),
                ]}
              >
                <CarouselContent>
                  {reviewsText.map((text, idx) => (
                    <CarouselItem key={idx} className="p-4">
                      <div>
                        <p>
                          <strong>Review:</strong> {text}
                        </p>
                        <p>
                          <strong>Rating:</strong>{" "}
                          {item.reviews_rating?.Data?.FloatData?.data?.[idx] ??
                            "N/A"}
                        </p>
                        <p>
                          <strong>Helpful Votes:</strong>{" "}
                          {item.reviews_helpful_vote?.Data?.IntData?.data?.[
                            idx
                          ] ?? "N/A"}
                        </p>
                        <p>
                          <strong>Verified Purchase:</strong>{" "}
                          {item.reviews_verified_purchase?.Data?.BoolData
                            ?.data?.[idx]
                            ? "Yes"
                            : "No"}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          {/* Additional Features */}
          {item.features?.Data?.StringData?.data?.length ? (
            <div className="mt-4">
              <p className="font-semibold">Features:</p>
              {item.features.Data.StringData.data.map((feature, idx) => (
                <p key={idx} className="ml-4">
                  - {feature}
                </p>
              ))}
            </div>
          ) : null}
        </div>
        <DrawerFooter className="mt-4">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchResultItem;
