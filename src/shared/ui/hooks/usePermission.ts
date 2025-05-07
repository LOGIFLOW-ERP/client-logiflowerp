import { useStore } from './useStore'

export function usePermissions(tagsToCheck: string[]): boolean[] {
	const { state: { tags } } = useStore('auth')
	return tagsToCheck.map(tag => tags.includes(tag))
}
