/**
 * Ember design system — public surface.
 *
 * Apps import from '@ember/ui' only. Nothing outside this package should
 * reach into '@ember/ui/src/components/...' directly, so that moving a file
 * is never a breaking change.
 */

// Layout
export { Container, type ContainerProps } from './components/Container'
export { Divider, type DividerProps } from './components/Divider'
export { SectionHeading, type SectionHeadingProps } from './components/SectionHeading'
export {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
  type CardProps,
} from './components/Card'

// Actions
export {
  Button,
  buttonVariants,
  type ButtonProps,
  type ButtonVariantProps,
} from './components/Button'
export { IconButton, type IconButtonProps } from './components/IconButton'
export { Chip, type ChipProps } from './components/Chip'

// Forms
export { Field, useField, controlBox, controlBorder, type FieldProps } from './components/Field'
export { Input, type InputProps } from './components/Input'
export { Textarea, type TextareaProps } from './components/Textarea'
export { Select, type SelectProps } from './components/Select'
export { Checkbox, type CheckboxProps } from './components/Checkbox'
export { RadioGroup, type RadioGroupProps, type RadioOption } from './components/RadioGroup'
export { Switch, type SwitchProps } from './components/Switch'
export { QuantityStepper, type QuantityStepperProps } from './components/QuantityStepper'

// Feedback
export { Alert, type AlertProps } from './components/Alert'
export { EmptyState, type EmptyStateProps } from './components/EmptyState'
export { Skeleton, type SkeletonProps } from './components/Skeleton'
export { Spinner, type SpinnerProps } from './components/Spinner'
export { ToastProvider, useToast, type ToastTone } from './components/Toast'

// Overlays
export { Modal, type ModalProps } from './components/Modal'
export { Drawer, type DrawerProps } from './components/Drawer'
export { Tooltip, type TooltipProps } from './components/Tooltip'

// Navigation
export { Breadcrumbs, type BreadcrumbsProps, type Crumb } from './components/Breadcrumbs'
export { Tabs, type TabsProps, type TabItem } from './components/Tabs'
export { Pagination, type PaginationProps } from './components/Pagination'
export { Accordion, type AccordionItem, type AccordionProps } from './components/Accordion'

// Data display
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from './components/Avatar'
export { Badge, type BadgeProps } from './components/Badge'
export { Stars, type StarsProps } from './components/Stars'
export { Price, formatPrice, type PriceProps } from './components/Price'
export { StatTile, type StatTileProps } from './components/StatTile'
export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableScroll,
  type TableCellProps,
  type TableRowProps,
} from './components/Table'

// Coffee domain
export {
  RoastMeter,
  ROAST_LABELS,
  ROAST_LEVELS,
  type RoastLevel,
  type RoastMeterProps,
} from './components/RoastMeter'
export {
  BagArtwork,
  COLORWAYS,
  colorwayFor,
  type BagArtworkProps,
  type Colorway,
} from './components/BagArtwork'

// Utilities
export { cn } from './lib/cn'
