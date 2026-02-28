interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-4',
}

export default function LoadingSpinner({ size = 'md' }: Props) {
  return (
    <div
      className={`${sizeMap[size]} rounded-full border-blue-200 border-t-blue-600 animate-spin`}
      role="status"
      aria-label="Loading"
    />
  )
}