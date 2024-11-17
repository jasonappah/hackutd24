import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAllImages, pinataCidToUrl, PinataFile } from '../lib/requests'
import { Package, User, Calendar, ImageIcon, CarTaxiFront } from 'lucide-react'

const getFirstNameFromFullName = (fullName: string) => fullName.split(' ')[0]

export function Home() {
  const [lostItems, setLostItems] = useState<PinataFile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
  
    useEffect(() => {
      const fetchLostItems = async () => {
        try {
          const response = await getAllImages()
          if (response.success) {
            setLostItems(response.data.files)
          } else {
            setError('Failed to fetch lost items')
          }
        } catch (err) {
          setError('An error occurred while fetching data')
        } finally {
          setLoading(false)
        }
      }
  
      fetchLostItems()
    }, [])
  
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>
    }
  
    if (error) {
      return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
    }
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Items Left Behind in Ubers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lostItems.map((item) => (
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
                    <img
                      src={pinataCidToUrl(item.cid)}
                      alt={`Image of ${item.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/placeholder.svg?height=200&width=300'
                      }}
                    />
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
                    {item.keyvalues.itemsLeftBehind?.map((leftItem, index) => (
                      <Badge key={index} variant="secondary">
                        {leftItem}
                      </Badge>
                    )) || <span className="text-sm text-muted-foreground">No items specified</span>}
                  </div>
                </ScrollArea>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
}
