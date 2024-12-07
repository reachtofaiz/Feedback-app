"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from '@/messages.json'


const Homepage = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12" >
        <section className="text-center mb-8 md:m-12">
          <h1 className="text-3xl md:text-4xl font-bold">Dive into the World of Anonymous Conversation </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">Explore Feedback app - where your identity remains a secret</p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader>
                        {
                          message.title
                        }
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-3xl font-semibold mb-20">{message.content}</span>
                      </CardContent>
                      <CardFooter>
                        <span className="text-l font-medium">{message.received}</span>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center p-4 md:p-6">
            © 2024 Feedback app. All rights reserved  
      </footer>
    </>
  )
}



export default Homepage