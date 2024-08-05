export const adminMenu = [
    { //quan li nguoi dung
        name: 'menu.admin.manage-user', menus: [
            {
                name: 'menu.admin.crud', link: '/system/user-manage' ,
                
            },
            {
                name: 'menu.admin.crud-redux', link: '/system/user-redux' ,
                
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor' ,
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
            {
                name: 'menu.admin.manage-admin', link: '/system/user-admin' ,
                
            },
           
        ]
    },
    { //quan li phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic' ,
                
            },
           
        ]
    },
    { //quan li chuyên khoa
        name: 'menu.admin.speciality',
        menus: [
            {
                name: 'menu.admin.manage-speciality', link: '/system/manage-speciality' ,
                
            },
           
        ]
    },
    { //quan li cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-handbook' ,
                
            },
           
        ]
    },
];