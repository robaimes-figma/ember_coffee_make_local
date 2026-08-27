import { Container, EmptyState } from '@ember/ui'
import { CoffeeIcon } from 'lucide-react'
import { ButtonLink } from '../components/ButtonLink'

export function NotFoundPage() {
  return (
    <Container className="py-24">
      <EmptyState
        icon={<CoffeeIcon className="size-6" aria-hidden />}
        title="This page went cold"
        description="The link may be out of date, or the coffee it pointed at has sold out and been retired."
        action={<ButtonLink to="/shop">Browse what's on the shelf</ButtonLink>}
      />
    </Container>
  )
}
