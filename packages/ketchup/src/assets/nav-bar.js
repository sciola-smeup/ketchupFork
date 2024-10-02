const noTreeData = [];
const simpleTreeData = [
    {
        cells: {},
        children: [
            {
                cells: {},
                children: [],
                disabled: false,
                expandable: false,
                icon: 'account',
                id: '0010400',
                isExpanded: false,
                obj: {
                    t: 'TN',
                    p: '',
                    k: 'SCIMAM',
                },
                options: false,
                value: 'Child1',
                shape: 'BTN',
                data: {},
                roleLevel: '00',
            },
            {
                cells: {},
                children: [],
                disabled: false,
                expandable: false,
                icon: 'favorite',
                id: '0010600',
                isExpanded: false,
                obj: {
                    t: 'TN',
                    p: '',
                    k: 'SCIMAM',
                },
                options: false,
                value: 'Child2',
                shape: 'BTN',
                data: {},
                roleLevel: '01',
            },
        ],
        disabled: false,
        expandable: false,
        icon: 'account',
        id: '0010300',
        isExpanded: false,
        obj: {
            t: 'TN',
            p: '',
            k: 'FIOGIA30',
        },
        options: false,
        value: 'More...',
        shape: 'BTN',
        data: {
            dropdownOnly: true,
            icon: 'more_vert',
        },
    },
    {
        cells: {},
        children: [],
        disabled: false,
        expandable: false,
        icon: 'account',
        id: '0010500',
        isExpanded: false,
        obj: {
            t: 'TN',
            p: '',
            k: 'SCIMAM',
        },
        options: false,
        // value: '',
        shape: 'BTN',
        data: {
            // icon: 'VO;COD_SOS;000104',
            // label: 'FILE',
            // dropdownOnly: true,
            // icon: 'more_vert',
        },
        roleLevel: '01',
    },
    {
        cells: {},
        children: [],
        disabled: false,
        expandable: false,
        icon: 'favorite',
        id: '0010000',
        isExpanded: false,
        obj: {
            t: 'V2',
            p: 'SI/NO',
            k: '',
        },
        options: false,
        value: 1,
        shape: 'SWT',
        data: {
            // value: 1,
            // icon: 'VO;COD_SOS;000104',
            // label: 'FILE',
            // dropdownOnly: true,
            // icon: 'more_vert',
        },
        roleLevel: '03',
    },
];

const navBarElement = document.querySelector('kup-nav-bar');
navBarElement.hide = false;
navBarElement.hideSearchBar = false;
navBarElement.data = simpleTreeData;
navBarElement.userRoleLevel = '00';

navBarElement.addEventListener('kup-navbar-on-click', (e) => {
    console.log(e.type, e);
    alert('LEFT: Esecuzione FUN');
});

navBarElement.addEventListener('kup-navbar-on-right-click', (e) => {
    console.log(e.type, e);
    alert('RIGHT: Visualizzione Oggetto');
});

// const barEl = document.querySelector('kup-nav-bar');
// const drawerEl = document.querySelector('kup-drawer');
// const drawerButtonEl = document.querySelector('#drawer-button');
// const dropdownEl = document.querySelector('kup-dropdown-button');
// const switchEl = document.querySelector('kup-switch');

// barEl.image = {
//     resource: 'https://smeup.github.io/ketchup/ketchup_logo_header.svg',
// };
// dropdownEl.data = {
//     'kup-list': {
//         data: [
//             {
//                 value: 'Short',
//                 id: 'short',
//             },
//             {
//                 value: 'Standard',
//                 id: 'standard',
//             },
//         ],
//     },
// };
// drawerEl.addEventListener('kup-drawer-close', (e) => {
//     console.log(e.type, e);
//     barEl.classList.remove('padded');
// });
// drawerEl.addEventListener('kup-drawer-open', (e) => {
//     console.log(e.type, e);
//     barEl.classList.add('padded');
// });
// drawerButtonEl.addEventListener('kup-button-click', (e) => {
//     console.log(e.type, e);
//     drawerEl.toggle();
// });
// dropdownEl.addEventListener('kup-dropdownbutton-itemclick', (e) => {
//     console.log(e.type, e);
//     barEl.styling = e.detail.value;
// });
// switchEl.addEventListener('kup-switch-change', (e) => {
//     console.log(e.type, e);
//     if (e.detail.value === 'on') {
//         document.documentElement.ketchup.theme.set('octane');
//     } else {
//         document.documentElement.ketchup.theme.set('darkGreyOctane');
//     }
// });
