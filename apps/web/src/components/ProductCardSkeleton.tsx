import { Card, CardBody, CardMedia, Skeleton } from '@ember/ui'

/**
 * Mirrors ProductCard's shape so the grid does not reflow when data lands.
 * If you change the card, change this too.
 */
export function ProductCardSkeleton() {
  return (
    <Card surface="outline" className="flex h-full flex-col">
      <CardMedia className="aspect-4/3">
        <Skeleton shape="block" className="h-full w-full rounded-none" />
      </CardMedia>

      <CardBody className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3.5 w-full" />

        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
        </div>
      </CardBody>
    </Card>
  )
}
