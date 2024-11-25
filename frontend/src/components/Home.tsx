import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { pinataCidToUrl, useAllImages } from '../lib/requests'
import { Package, User, Calendar, ImageIcon, CarTaxiFront, LoaderCircle } from 'lucide-react';
import LazyLoad from 'react-lazyload';

const getFirstNameFromFullName = (fullName: string) => {
  const split = fullName.split(' ')
  return split.find(word => word !== 'Mr.' && word !== 'Mrs.' && word !== 'Ms.' && word !== 'Dr.')
}

export function Home() {
  const { data: lostItems, isLoading, error, isRefetching } = useAllImages()


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">An error occurred. Please try again later.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex mb-6 gap-2">
        <h1 className="text-2xl font-bold mb-6">Backtracc</h1>
        {isRefetching && <div className="flex justify-center items-center h-screen"><LoaderCircle className="animate-spin h-5 w-5 text-primary-foreground" /> </div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lostItems?.data.files.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span className="truncate">{getFirstNameFromFullName(item.keyvalues.passengerName)}'s ride with {getFirstNameFromFullName(item.keyvalues.driverName)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="w-full h-48 mb-4 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                {item.mime_type.startsWith('image/') ? (
                  <LazyLoad height={200} offset={100} once={true}>
                    <img
                      src={pinataCidToUrl(item.cid)}
                      alt={`Image of ${item.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/placeholder.svg?height=200&width=300'
                      }}
                    />
                  </LazyLoad>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span>No image available</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CarTaxiFront className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.keyvalues.driverName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.keyvalues.passengerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{new Date(item.keyvalues.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <ScrollArea className="h-20 w-full">
                <div className="flex flex-wrap gap-2">
                  {item.keyvalues.description || <span className="text-sm text-muted-foreground">No items specified</span>}
                </div>
              </ScrollArea>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
