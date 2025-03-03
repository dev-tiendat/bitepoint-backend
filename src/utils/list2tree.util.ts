export function deleteEmptyCHildren(arr: any) {
    arr?.forEach(node => {
        if (node.children?.length === 0) delete node.children;
        else deleteEmptyCHildren(node.children);
    });
}
