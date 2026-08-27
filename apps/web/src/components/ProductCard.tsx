import type { Product } from '@ember/api/types'
import {
  BagArtwork,
  Badge,
  Card,
  CardBody,
  CardMedia,
  Price,
  RoastMeter,
  Stars,
  colorwayFor,
} from '@ember/ui'
import { Link } from 'react-router-dom'

export interface ProductCardProps {
  product: Product
}

/**
 * ProductCard
 *
 * Used in the shop grid, the "you might also like" row and the home page
 * featured strip. One card, three contexts — so it has to survive both a
 * four-up desktop grid and a single narrow column.
 */
export function ProductCard({ product }: ProductCardProps) {
  const cheapest = Math.min(...product.variants.map((variant) => variant.priceCents))
  const inStock = product.variants.some((variant) => variant.stock > 0)
  const lowStock = inStock && product.variants.every((variant) => variant.stock < 15)

  return (
    <Card interactive surface="outline" className="group flex h-full flex-col">
      <Link to={`/shop/${product.slug}`} className="flex h-full flex-col">
        <CardMedia className="aspect-4/3">
          <BagArtwork
            colorway={colorwayFor(product.id)}
            origin={product.origin}
            caption={product.process}
            className="transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {product.limitedRelease ? (
              <Badge tone="accent" size="sm">
                Limited release
              </Badge>
            ) : null}
            {!inStock ? (
              <Badge tone="neutral" size="sm">
                Sold out
              </Badge>
            ) : lowStock ? (
              <Badge tone="success" size="sm">
                Low stock
              </Badge>
            ) : null}
          </div>
        </CardMedia>

        <CardBody className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <p className="text-2xs font-semibold tracking-widest text-subtle uppercase">
                {product.origin}
              </p>
              <h3 className="truncate text-base font-semibold">{product.name}</h3>
            </div>
            <RoastMeter level={product.roast} compact />
          </div>

          <p className="text-sm text-muted line-clamp-fixed-2">{product.tastingNotes.join(' · ')}</p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            <Price cents={cheapest} size="md" />
            <Stars rating={product.rating} size="sm" reviewCount={product.reviewCount} />
          </div>
        </CardBody>
      </Link>
    </Card>
  )
}
