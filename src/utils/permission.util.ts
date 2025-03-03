import { MenuEntity } from '~/modules/system/menu/menu.entity';

function filterMenuToTable(menus: MenuEntity[], parentMenu) {
    const res = [];
    menus.forEach(menu => {
        let realMenu;
        if (!parentMenu && !menu.parentId && menu.type === 1) {
            const childMenu = filterMenuToTable(menus, menu);
            realMenu = { ...menu };
            realMenu.children = childMenu;
        } else if (!parentMenu && !menu.parentId && menu.type === 0) {
            const childMenu = filterMenuToTable(menus, menu);
            realMenu = { ...menu };
            realMenu.children = childMenu;
        } else if (
            parentMenu &&
            parentMenu.id === menu.parentId &&
            menu.type === 1
        ) {
            const childMenu = filterMenuToTable(menus, menu);
            realMenu = { ...menu };
            realMenu.children = childMenu;
        } else if (
            parentMenu &&
            parentMenu.id === menu.parentId &&
            menu.type === 0
        ) {
            const childMenu = filterMenuToTable(menus, menu);
            realMenu = { ...menu };
            realMenu.children = childMenu;
        } else if (
            parentMenu &&
            parentMenu.id === menu.parentId &&
            menu.type === 2
        ) {
            realMenu = { ...menu };
        }

        if (realMenu) {
            realMenu.pid = menu.id;
            res.push(realMenu);
        }
    });
    return res;
}

export function generatorMenu(menu: MenuEntity[]) {
    return filterMenuToTable(menu, null);
}
