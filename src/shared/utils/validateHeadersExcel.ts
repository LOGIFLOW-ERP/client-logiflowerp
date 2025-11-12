export interface HeaderValidationResult {
    matchedModel: { name: string, i: number }[]; // índices en los headers que cumplen el modelo
}

export function validateHeadersExcel(
    headers: string[],
    models: string[][]
): HeaderValidationResult {
    const errors: string[] = [];

    // 🔹 1. Validar que existan modelos
    if (models.length === 0) {
        throw new Error('No se definieron modelos para validar.');
    }

    // 🔹 2. Detectar duplicados (exact match)
    const duplicates = headers.filter((h, i) => headers.indexOf(h) !== i);
    if (duplicates.length > 0) {
        errors.push(`Encabezados duplicados: ${[...new Set(duplicates)].join(', ')}`);
    }

    // 🔹 3. Buscar modelos que cumplan
    const matchedModels = models
        .map(model => ({
            model,
            missing: model.filter(m => !headers.includes(m)),
        }))
        .filter(m => m.missing.length === 0);

    // 🔹 4. Validar cantidad de modelos que cumplen
    if (matchedModels.length === 0) {
        const modelList = models.map(m => `[${m.join(', ')}]`).join(' o ');
        errors.push(`Los encabezados no cumplen con ningún modelo válido (${modelList}).`);
    } else if (matchedModels.length > 1) {
        const modelList = matchedModels.map(m => `[${m.model.join(', ')}]`).join(' o ');
        errors.push(`Los encabezados coinciden con más de un modelo válido (${modelList}).`);
    }

    if (errors.length > 0) {
        throw new Error(errors.join(' | '));
    }

    // 🔹 5. Calcular los índices de headers donde aparece el modelo que cumple
    const matchedModel = matchedModels[0].model;
    const headerIndexes = matchedModel.map(m => ({ i: headers.indexOf(m), name: m }));

    return { matchedModel: headerIndexes };
}
