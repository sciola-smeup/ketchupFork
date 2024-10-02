import {
    Component,
    Element,
    Event,
    EventEmitter,
    forceUpdate,
    h,
    Host,
    Method,
    Prop,
    VNode,
} from '@stencil/core';
import {
    KupNavBarStyling,
    KupNavBarProps,
    navbarClass,
    KupNavBarUserRoleLevel,
    KupNavBarMenuPosition,
} from './kup-nav-bar-declarations';
import type {
    GenericObject,
    KupComponent,
    KupEventPayload,
} from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../managers/kup-manager/kup-manager';
import { getProps, setProps } from '../../utils/utils';
import { componentWrapperId } from '../../variables/GenericVariables';
import { KupTreeNode } from '../kup-tree/kup-tree-declarations';
import { FCell } from '../../f-components/f-cell/f-cell';
import {
    FCellPadding,
    FCellProps,
    FCellShapes,
} from '../../f-components/f-cell/f-cell-declarations';
import { on } from 'events';

@Component({
    tag: 'kup-nav-bar',
    styleUrl: 'kup-nav-bar.scss',
    shadow: true,
})
export class KupNavBar {
    /**
     * References the root HTML element of the component (<kup-nav-bar>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/

    /**
     * Custom style of the component.
     * @default ""
     * @see https://smeup.github.io/ketchup/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Defines the style of the nav bar.
     * @default KupNavBarStyling.STANDARD
     */
    @Prop({ reflect: true }) styling: KupNavBarStyling =
        KupNavBarStyling.STANDARD;

    /**
     * Defines if the navbar is visible or not.
     * @default false
     */
    @Prop() hide: boolean = false;

    /**
     * Defines the user role permission.
     * @default KupNavBarUserAuth.L00
     */
    @Prop() userRoleLevel: KupNavBarUserRoleLevel = KupNavBarUserRoleLevel.L00;

    /**
     * Defines if the search bar is displayed or not.
     * @default false
     */
    @Prop() hideSearchBar: boolean = false;

    /**
     * Data for the nodes of the nav bar.
     * @default null
     */
    @Prop() data: KupTreeNode[] = null;

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    /**
     * Used to prevent too many resizes callbacks at once.
     */
    private resizeTimeout: number;

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    /**
     * Triggered when the component is ready.
     */
    @Event({
        eventName: 'kup-navbar-ready',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupNavbarReady: EventEmitter<KupEventPayload>;
    /**
     * Triggered when the component is resize.
     */
    @Event({
        eventName: 'kup-navbar-resize',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupNavbarResize: EventEmitter<KupEventPayload>;

    @Event({
        eventName: 'kup-navbar-on-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupNavbarOnClick: EventEmitter<KupEventPayload>;

    @Event({
        eventName: 'kup-navbar-on-right-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupNavbarOnRightClick: EventEmitter<KupEventPayload>;

    /*-------------------------------------------------*/
    /*           P u b l i c   M e t h o d s           */
    /*-------------------------------------------------*/

    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupNavBarProps, descriptions);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }
    /**
     * This method is invoked by KupManager whenever the component changes size.
     */
    @Method()
    async resizeCallback(): Promise<void> {
        window.clearTimeout(this.resizeTimeout);
        this.resizeTimeout = window.setTimeout(() => {
            this.kupNavbarResize.emit({
                comp: this,
                id: this.rootElement.id,
            });
        }, 300);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupNavBarProps, props);
    }

    /*-------------------------------------------------*/
    /*           P r i v a t e   M e t h o d s         */
    /*-------------------------------------------------*/

    #getSearchBarComponent() {
        console.log('DEBUG: hideSearchBar', this.hideSearchBar);
        if (this.hideSearchBar) {
            return null;
        }
        return (
            <section
                class={`${navbarClass}__section ${navbarClass}__section--align-center`}
            >
                <kup-text-field
                    key="searchbar"
                    class={'searchbar'}
                    id="searchbar"
                    slot={'center'}
                    icon="magnify"
                    custom-style="searchbar"
                    // onKup-textfield-submit={onSearchBarSubmit}
                ></kup-text-field>
            </section>
        );
    }

    // fcellProp: FCellProps = {
    //     cell: {
    //         data: {
    //             data: [
    //                 {
    //                     children: [
    //                         {
    //                             children: [],
    //                             disabled: false,
    //                             expandable: false,
    //                             icon: 'pencil',
    //                             isExpanded: false,
    //                             obj: {
    //                                 k: '000050',
    //                                 p: 'COD_VER',
    //                                 t: 'VO',
    //                             },
    //                             options: false,
    //                             value: 'Modifica',
    //                         },
    //                     ],
    //                     data: {
    //                         dropdownOnly: true,
    //                         icon: 'more_vert',
    //                     },
    //                     disabled: false,
    //                     expandable: false,
    //                     isExpanded: false,
    //                     options: false,
    //                 },
    //             ],
    //             icon: 'more_vert',
    //             styling: 'icon',
    //         },
    //         obj: {
    //             t: 'VO',
    //             p: 'CODVER',
    //             k: 'Modifica',
    //         },
    //         shape: FCellShapes.BUTTON_LIST,
    //         value: '',
    //     },
    //     column: {
    //         name: 'FLD1',
    //         title: 'Opzioni',
    //     },
    //     component: this,
    //     density: FCellPadding.MEDIUM,
    //     editable: false,
    //     indents: [],
    //     renderKup: true,
    //     row: {},
    //     setSizes: true,
    // };

    #extractFPropsFromTreeNode(data: KupTreeNode[]): FCellProps[] {
        const cellsProps: FCellProps[] = [];

        if (!data || !data.length) {
            return null;
        }

        for (const node of data) {
            console.log('DEBUG: Node', node);
            const authorizedKupTreeNode = this.#removeUnauthorizedNode(node);

            authorizedKupTreeNode
                ? cellsProps.push(this.#renderCell(authorizedKupTreeNode))
                : null;
        }

        console.log('DEBUG: Cells props', cellsProps);

        return cellsProps;
    }

    // TODO: farlo meglio e spostarlo lato webupjs
    #removeUnauthorizedNode(node: KupTreeNode): KupTreeNode | void {
        if (!this.#isAuthorized(node)) {
            console.log('DEBUG: Unthorized Node', node);
            return;
        }

        console.log('DEBUG: Authorized Node', node);

        if (this.#hasChildren(node)) {
            const children = [];

            node.children.forEach((child) => {
                const res = this.#removeUnauthorizedNode(child);
                if (res) {
                    children.push(res);
                }
            });

            node.children = children;
        }
        return node;
    }

    #isAuthorized(node: KupTreeNode) {
        node.roleLevel === undefined || node.roleLevel == null
            ? (node.roleLevel = KupNavBarUserRoleLevel.L00)
            : null;
        return Number(node.roleLevel) <= Number(this.userRoleLevel);
    }

    #renderCell(node: KupTreeNode): FCellProps {
        const defClick = async () => {
            this.kupNavbarOnClick.emit({
                comp: this,
                id: this.rootElement.id,
            });
        };
        const defRightClick = async () => {
            this.kupNavbarOnRightClick.emit({
                comp: this,
                id: this.rootElement.id,
            });
        };

        // TODO: debug
        if (this.#hasChildren(node)) {
            console.log('DEBUG: Node has children', node);
        }

        const props: FCellProps = {
            component: this,
            density: FCellPadding.MEDIUM,
            editable: true,
            indents: [],
            renderKup: true,
            row: {},
            setSizes: true,
            column: {
                name: '',
                title: '',
            },
            cell: {
                data: {
                    data: [node],
                    onclick: defClick,
                    oncontextmenu: defRightClick,
                },
                shape: node.shape ? node.shape : FCellShapes.BUTTON_LIST,
                value: '',
            },
        };

        console.log('DEBUG: Props', props);

        return props;
    }

    #hasChildren(node: KupTreeNode): boolean {
        return node.children?.length > 0;
    }

    #getSideMenuComponent(
        side: KupNavBarMenuPosition,
        listCellsProps: FCellProps[]
    ) {
        if (listCellsProps) {
            return (
                <section
                    class={`${navbarClass}__section ${navbarClass}__section--align-start`}
                >
                    {listCellsProps.map((prop) => {
                        return <FCell {...prop}></FCell>;
                    })}
                </section>
            );
        }

        return null;
    }

    /**
     * Reads the slots returning them as an array of virtual nodes.
     */
    #renderMenuContent(inputData: KupTreeNode[]): VNode[] {
        if (!inputData) {
            return null;
        }

        const fcellProps = this.#extractFPropsFromTreeNode(this.data);

        return [
            // this.getSideMenuComponent(KupNavBarMenuPosition.LEFT, leftSide),
            this.#getSearchBarComponent(),
            this.#getSideMenuComponent(KupNavBarMenuPosition.RIGHT, fcellProps),
        ];
    }

    #render() {
        if (this.hide) {
            return null;
        }

        return (
            <div>
                <style>
                    {this.kupManager.theme.setKupStyle(
                        this.rootElement as KupComponent
                    )}
                </style>
                <div id={componentWrapperId}>
                    <header
                        class={`${navbarClass} ${navbarClass}--${this.styling.toLowerCase()} `}
                    >
                        <div class={`${navbarClass}__row`}>
                            {this.#renderMenuContent(this.data)}
                        </div>
                    </header>
                </div>
            </div>
        );
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.language.register(this);
        this.kupManager.theme.register(this);
    }

    componentDidLoad() {
        this.kupNavbarReady.emit({
            comp: this,
            id: this.rootElement.id,
        });
        this.kupManager.resize.observe(this.rootElement);
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        return <Host class="header">{this.#render()};</Host>;
    }

    disconnectedCallback() {
        this.kupManager.language.unregister(this);
        this.kupManager.resize.unobserve(this.rootElement);
        this.kupManager.theme.unregister(this);
    }
}
