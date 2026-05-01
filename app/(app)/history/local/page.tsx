import { LocalSessionView } from '@/components/history/LocalSessionView'

export default async function LocalSessionPage(props: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await props.searchParams
  return <LocalSessionView id={id ?? ''} />
}
