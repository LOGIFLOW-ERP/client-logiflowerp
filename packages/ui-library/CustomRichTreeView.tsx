import Box from '@mui/material/Box'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks'
import { TreeViewBaseItem } from '@mui/x-tree-view/models'
import React from 'react'

function getItemDescendantsIds(item: TreeViewBaseItem) {
	const ids: string[] = []
	item.children?.forEach((child) => {
		ids.push(child.id)
		ids.push(...getItemDescendantsIds(child))
	})
	return ids
}

function buildParentMap(
	node: TreeViewBaseItem,
	parentMap: Map<string, string>,
	parentId?: string
) {
	if (parentId) {
		parentMap.set(node.id, parentId)
	}

	if (node.children) {
		node.children.forEach((child) => {
			buildParentMap(child, parentMap, node.id)
		})
	}
}

function getItemAncestorsIds(
	item: TreeViewBaseItem,
	parentMap = new Map<string, string>()
) {

	const ids: string[] = []
	let currentId = item.id

	while (parentMap.has(currentId)) {
		const parentId = parentMap.get(currentId)!
		ids.push(parentId)
		currentId = parentId
	}

	return ids
}

interface IProps {
	items: TreeViewBaseItem[]
	selectedItems: string[]
	setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
}

export function CustomRichTreeView(props: IProps) {
	const { items, selectedItems, setSelectedItems } = props
	const toggledItemRef = React.useRef<{ [itemId: string]: boolean }>({})
	const apiRef = useTreeViewApiRef()

	const handleItemSelectionToggle = (
		_event: React.SyntheticEvent,
		itemId: string,
		isSelected: boolean,
	) => {
		toggledItemRef.current[itemId] = isSelected
	}

	const handleSelectedItemsChange = (
		_event: React.SyntheticEvent,
		newSelectedItems: string[],
	) => {
		setSelectedItems(newSelectedItems)

		const itemsToSelect: string[] = []
		const itemsToUnSelect: { [itemId: string]: boolean } = {}

		const parentMap = new Map<string, string>()
		items.forEach((node) => buildParentMap(node, parentMap))

		const newSelectedSet = new Set(newSelectedItems)

		Object.entries(toggledItemRef.current).forEach(([itemId, isSelected]) => {
			const item = apiRef.current!.getItem(itemId)

			if (isSelected) {
				itemsToSelect.push(...getItemDescendantsIds(item))
				itemsToSelect.push(...getItemAncestorsIds(item, parentMap));
			} else {
				getItemDescendantsIds(item).forEach((descendantId) => {
					itemsToUnSelect[descendantId] = true
				})
				for (const ancestorId of getItemAncestorsIds(item, parentMap)) {
					const ancestor = apiRef.current!.getItem(ancestorId)
					const hasSelectedSiblings = ancestor.children.some((child: any) =>
						newSelectedSet.has(child.id)
					)

					if (!hasSelectedSiblings) {
						newSelectedSet.delete(ancestorId)
						itemsToUnSelect[ancestorId] = true
					} else {
						break
					}
				}
			}
		})

		const newSelectedItemsWithChildren = Array.from(
			new Set(
				[...newSelectedItems, ...itemsToSelect].filter(
					(itemId) => !itemsToUnSelect[itemId],
				),
			),
		)

		setSelectedItems(newSelectedItemsWithChildren)

		toggledItemRef.current = {}
	}

	return (
		<Box sx={{ minHeight: 200, minWidth: 300 }} marginY={2}>
			<RichTreeView
				multiSelect
				checkboxSelection
				apiRef={apiRef}
				items={items}
				selectedItems={selectedItems}
				onSelectedItemsChange={handleSelectedItemsChange}
				onItemSelectionToggle={handleItemSelectionToggle}
			/>
		</Box>
	)
}