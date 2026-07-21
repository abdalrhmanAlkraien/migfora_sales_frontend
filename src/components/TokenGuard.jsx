import useTokenGuard from '../hooks/useTokenGuard'

export default function TokenGuard({ children }) {
  useTokenGuard()
  return children
}