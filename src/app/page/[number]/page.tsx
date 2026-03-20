// TODO: Implement paginated blog listing page
// - Show posts for given page number
// - Include pagination controls

export async function generateStaticParams() {
	return [{ number: '1' }]
}

export default function PaginatedPage() {
	return <div>TODO: Paginated page</div>
}
