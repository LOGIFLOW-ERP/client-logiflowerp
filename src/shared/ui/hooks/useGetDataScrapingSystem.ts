import { PERMISSIONS } from "@shared/application";
import { usePermissions } from "./usePermission";
import { getDataScrapingSystem, ScrapingSystem } from "logiflowerp-sdk";

export function useGetDataScrapingSystem() {
    const [
        canPOST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_TOA,
        canPOST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_WIN,
    ] = usePermissions([
        PERMISSIONS.POST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_TOA,
        PERMISSIONS.POST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_WIN,
    ])

    return getDataScrapingSystem()
        .filter(el => canPOST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_TOA || el.value !== ScrapingSystem.TOA)
        .filter(el => canPOST_WAREHOUSE_EXIT_AUTOMATIC_REPLENISHMENT_WIN || el.value !== ScrapingSystem.WIN)
}
