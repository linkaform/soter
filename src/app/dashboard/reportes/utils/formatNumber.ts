// utils/formatNumber.ts
export function formatNumber(num: number | string) {
    return new Intl.NumberFormat("es-MX").format(Number(num));
}