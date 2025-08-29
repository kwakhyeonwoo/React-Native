//재사용 유틸 - 제네릭, 구조적 타이핑
export function mkId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function updateById<T extends {id: string} > (
    list: T[],
    id: string,
    updater: (item: T) => T
): T[] {
    return list.map((it) => (it.id === id ? updater(it): it));
}

export function removeById<T extends {id: string} >(list: T[], id: string): T[] {
    return list.filter((it) => it.id !== id);
}