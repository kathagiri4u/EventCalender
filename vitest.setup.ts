import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { createElement } from 'react'

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    unoptimized: _unoptimized,
    ...props
  }: {
    src: string
    alt: string
    fill?: boolean
    priority?: boolean
    unoptimized?: boolean
    [key: string]: unknown
  }) => createElement('img', { src, alt, ...(props as Record<string, unknown>) }),
}))
