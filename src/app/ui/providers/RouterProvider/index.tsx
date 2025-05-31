import { ErrorElement } from '@app/ui/components';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const modules = import.meta.glob('../../../../../src/**/Layout*.tsx')

export function buildRoutes() {


    const contextGroups: Map<string, Map<string, string[]>> = new Map()

    for (const filePath in modules) {
        const parts = filePath.split('/');
        const context = parts.find(part => part.startsWith('context'))

        if (!context) continue

        if (!contextGroups.has(context)) {
            contextGroups.set(context, new Map())
        }

        const _context = contextGroups.get(context)

        if (!_context) continue

        const indexContext = parts.findIndex(part => part === context)
        const module = parts.find((_part, index) => indexContext + 1 === index)

        if (!module) continue

        if (!_context.has(module)) {
            _context.set(module, [])
        }

        _context.get(module)!.push(filePath)
    }

    const ___children: RouteObject[] = []

    for (const [key, value] of contextGroups.entries()) {

        const children: RouteObject = {
            path: key.replace(/^context/, ''),
            children: []
        }

        for (const [_key, _value] of value.entries()) {
            const _children: RouteObject = {
                path: _key,
                Component: null,
                children: [],
                errorElement: <ErrorElement />,
            }
            for (const element of _value) {
                const Component = lazy(modules[element] as any)
                const parts = element.split('/')
                const _index = parts.findIndex(part => part === _key)
                const module = parts.find((_part, index) => _index + 1 === index)
                const __children: RouteObject = {
                    path: module,
                    Component
                }
                _children.children?.push(__children)
            }
            children.children?.push(_children)
        }

        ___children.push(children)

    }

    return ___children

}
