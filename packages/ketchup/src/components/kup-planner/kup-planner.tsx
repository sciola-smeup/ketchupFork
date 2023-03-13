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
    State,
} from '@stencil/core';
import {
    KupManager,
    kupManagerInstance,
} from '../../managers/kup-manager/kup-manager';
import { GenericObject } from '../../types/GenericTypes';
import {
    defaultStylingOptions,
    KupPlannerEventPayload,
    KupPlannerGanttTask,
    KupPlannerLastOnChangeReceived,
    KupPlannerPhase,
    KupPlannerProps,
    KupPlannerTaskAction,
    KupPlannerGanttRowType,
    KupPlannerDetail,
} from './kup-planner-declarations';
import { getProps, setProps } from '../../utils/utils';
import { componentWrapperId } from '../../variables/GenericVariables';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { KupDataDataset } from '../../managers/kup-data/kup-data-declarations';
import {
    Detail,
    GanttRow,
    GanttTask,
    Planner,
    PlannerProps,
} from '@sme.up/gantt-component';
import { getCellValueForDisplay } from '../../utils/cell-utils';
import { TaskType } from '@sme.up/gantt-component/dist/types/public-types';

@Component({
    tag: 'kup-planner',
    styleUrl: 'kup-planner.scss',
    shadow: true,
})
export class KupPlanner {
    /**
     * References the root HTML element of the component (<kup-planner>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                   S t a t e s                   */
    /*-------------------------------------------------*/

    /**
     * The value of the component.
     * @default ""
     */

    @State()
    plannerProps: PlannerProps;

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/

    /**
     * Custom style of the component.
     * @default ""
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop()
    customStyle: string = '';

    /**
     * Dataset containg the tasks list
     * @default null
     */
    @Prop()
    data: KupDataDataset;

    /**
     * Dataset containg the details list
     * @default null
     */
    @Prop()
    detailData: KupDataDataset;

    /**
     * Column containing the detail color, in hex format
     * @default null
     */
    @Prop()
    detailColorCol: string;

    /**
     * Columns containing informations displayed in the left box, near the gantt of details
     * @default null
     */
    @Prop()
    detailColumns: string[];

    /**
     * Columns containing detail duration, from (firstDate) to (secondDate)
     * @default null
     */
    @Prop()
    detailDates: string[];

    /**
     * Column containing unique detail identifier
     * @default null
     */
    @Prop()
    detailIdCol: string;

    /**
     * Column containing detail name displayed
     * @default null
     */
    @Prop()
    detailNameCol: string;

    /**
     * Columns containing fForecast detail duration, from (firstDate) to (secondDate)
     * @default null
     */
    @Prop()
    detailPrevDates: string[];

    /**
     * Total size of the cells inside to the left box, near the gantt
     * @default '300px'
     */
    @Prop()
    listCellWidth: string = '300px';

    /**
     * Column containing the phase color in hex format
     * @default null
     */
    @Prop()
    phaseColorCol: string;

    /**
     * Columns containing informations displayed in the left box ,near the gantt of phases
     * @default null
     */
    @Prop()
    phaseColumns: string[];

    /**
     * Column containing the name of the parent phases
     * @default null
     */
    @Prop()
    phaseColParDep: string;

    /**
     * Columns containing phase duration, from (firstDate) to (secondDate)
     * @default null
     */
    @Prop()
    phaseDates: string[];

    /**
     * Column containing unique phase identifier
     * @default null
     */
    @Prop()
    phaseIdCol: string;

    /**
     * Column containing phase name displayed
     * @default null
     */
    @Prop()
    phaseNameCol: string;

    /**
     * Columns containing forecast phase duration, from (firstDate) to (secondDate)
     * @default null
     */
    @Prop()
    phasePrevDates: string[];

    /**
     * Enable/disable display of secondary dates
     * @default false
     */
    @Prop()
    showSecondaryDates: boolean = false;

    /**
     * Columns containing informations displayed in the left box, near the gantt
     * @default null
     */
    @Prop()
    taskColumns: string[];

    /**
     * Columns containing task duration, from (firstDate) to (secondDate)
     * @default null
     */
    @Prop()
    taskDates: string[];

    /**
     * Column containing unique task identifier
     * @default null
     */
    @Prop()
    taskIdCol: string;

    /**
     * Column containing task name displayed
     * @default null
     */
    @Prop()
    taskNameCol: string;

    /**
     * Columns containing forecast task duration, from (firstDate) to (secondDate)
     * @default null
     */
    @Prop()
    taskPrevDates: string[];

    /**
     * Message displayed on top
     * @default null
     */
    @Prop()
    titleMess: string;

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    #kupManager: KupManager = kupManagerInstance();
    #rootPlanner;
    #lastOnChangeReceived: KupPlannerLastOnChangeReceived;

    #renderReactPlannerElement() {
        this.#rootPlanner?.unmount();

        const componentWrapperElement =
            this.rootElement.shadowRoot.getElementById(componentWrapperId);

        if (componentWrapperElement) {
            this.#rootPlanner = createRoot(componentWrapperElement);
            this.#rootPlanner.render(
                React.createElement(Planner, this.plannerProps)
            );
        }
    }

    #toTasks(data: KupDataDataset): GanttTask[] {
        let tasks: GanttTask[] = data.rows?.map((row) => {
            let task: KupPlannerGanttTask = {
                taskRow: row,
                taskRowId: row.id,
                id: row.cells[this.taskIdCol].value,
                name: row.cells[this.taskNameCol].value,
                startDate: row.cells[this.taskDates[0]].value,
                endDate: row.cells[this.taskDates[1]].value,
                secondaryStartDate: row.cells[this.taskPrevDates[0]].value,
                secondaryEndDate: row.cells[this.taskPrevDates[1]].value,
                type: 'task' as TaskType,
                valuesToShow: this.taskColumns.map(
                    (col) => row.cells[col].value
                ),
                rowType: KupPlannerGanttRowType.TASK,
            };
            return task;
        });
        return tasks;
    }

    #toDetails(data: KupDataDataset): Detail[] {
        let details: Detail[] = [];
        data.rows.forEach((row) => {
            const detailId = row.cells[this.detailIdCol].value;
            const detailNameId = row.cells[this.detailNameCol].value;
            const valuesToShow = this.detailColumns.map(
                (col) => row.cells[col].value
            );

            let detail: Detail = details.find((det) => det.id == detailId);
            if (!detail) {
                detail = {
                    id: detailId,
                    name: detailNameId,
                    type: 'timeline',
                    valuesToShow: valuesToShow,
                    schedule: [],
                };
                details.push(detail);
            }
            detail.schedule.push({
                startDate: row.cells[this.detailDates[0]].value,
                endDate: row.cells[this.detailDates[1]].value,
                color: this.detailColorCol
                    ? row.cells[this.detailColorCol].value
                    : '#D9D9D8',
                selectedColor: this.detailColorCol
                    ? row.cells[this.detailColorCol].value
                    : '#D9D9D8',
            });
        });

        return details;
    }

    #getTask(taskId: string): KupPlannerGanttTask {
        return (
            this.plannerProps.mainGantt.items as KupPlannerGanttTask[]
        ).find((task) => task.id == taskId);
    }

    #removePhases(taskId: string) {
        const task = this.#getTask(taskId);
        if (task) task.phases = undefined;
        this.plannerProps = { ...this.plannerProps };
    }

    /**
     * @param nativeEvent
     * @returns true if caller must call onKupClick
     */
    #handleOnClickOnTask(nativeEvent: GanttRow): boolean {
        const task = this.#getTask(nativeEvent.id);
        if (task?.phases) {
            this.#removePhases(task.id);
        }
        return true;
    }

    /**
     * @returns true if caller must call onKupClick
     */
    #handleOnClickOnPhase(): boolean {
        return true;
    }

    /**
     * @returns true if caller must call onKupClick
     */
    #handleOnClickOnDetail(): boolean {
        return true;
    }

    #emitOnChangeEventsReceived(nativeEvent: GanttRow): boolean {
        let emitEvent: boolean = false;
        if (!this.#lastOnChangeReceived) {
            emitEvent = true;
            this.#lastOnChangeReceived = new KupPlannerLastOnChangeReceived(
                nativeEvent
            );
        } else if (!this.#lastOnChangeReceived.isEquivalent(nativeEvent)) {
            this.#lastOnChangeReceived = new KupPlannerLastOnChangeReceived(
                nativeEvent
            );
            emitEvent = true;
        }
        return emitEvent;
    }

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    @Event({
        eventName: 'kup-planner-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<KupPlannerEventPayload>;

    onKupClick(event: GanttRow, taskAction?: KupPlannerTaskAction) {
        this.kupClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: event,
            taskAction: taskAction,
        });
    }

    @Event({
        eventName: 'kup-planner-datechange',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDateChange: EventEmitter<KupPlannerEventPayload>;

    onKupDateChange(event: GanttRow) {
        this.kupDateChange.emit({
            comp: this,
            id: this.rootElement.id,
            value: event,
        });
    }

    @Event({
        eventName: 'kup-planner-ready',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupReady: EventEmitter<KupPlannerEventPayload>;

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
        return getProps(this, KupPlannerProps, descriptions);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupPlannerProps, props);
    }

    /**
     * Add a list of phases to the project
     * @param taskId
     * @param data - Matrix which contains project phases
     */
    @Method()
    async addPhases(taskId: string, data: KupDataDataset) {
        const task = this.#getTask(taskId);
        if (task) {
            task.phases = data.rows?.map((row) => {
                let phase: KupPlannerPhase = {
                    taskRow: task.taskRow,
                    phaseRow: row,
                    id: row.cells[this.phaseIdCol].value,
                    phaseRowId: row.id,
                    taskRowId: task.taskRowId,
                    name: row.cells[this.phaseNameCol].value,
                    startDate: row.cells[this.phaseDates[0]].value,
                    endDate: row.cells[this.phaseDates[1]].value,
                    secondaryStartDate: row.cells[this.phasePrevDates[0]].value,
                    secondaryEndDate: row.cells[this.phasePrevDates[1]].value,
                    type: 'task' as TaskType,
                    color: row.cells[this.phaseColorCol].value,
                    valuesToShow: this.phaseColumns.map((col) =>
                        col == this.phaseDates[0]
                            ? '#START#'
                            : col == this.phaseDates[1]
                            ? '#END#'
                            : getCellValueForDisplay(
                                  data.columns.find((kCol) => kCol.name == col),
                                  row.cells[col]
                              )
                    ),
                    selectedColor: row.cells[this.phaseColorCol].value,
                    rowType: KupPlannerGanttRowType.PHASE,
                };
                return phase;
            });
        }

        this.plannerProps = { ...this.plannerProps };
    }

    handleOnClick(
        nativeEvent: KupPlannerGanttTask | KupPlannerPhase | KupPlannerDetail
    ) {
        console.log('handleOnClick', nativeEvent);
        switch (nativeEvent.rowType) {
            case KupPlannerGanttRowType.TASK:
                const taskAction = (nativeEvent as KupPlannerGanttTask).phases
                    ? KupPlannerTaskAction.onClosing
                    : KupPlannerTaskAction.onOpening;
                if (this.#handleOnClickOnTask(nativeEvent)) {
                    this.onKupClick(nativeEvent, taskAction);
                }
                break;
            case KupPlannerGanttRowType.PHASE:
                if (this.#handleOnClickOnPhase()) {
                    this.onKupClick(nativeEvent);
                }
                break;
            case KupPlannerGanttRowType.DETAIL:
                if (this.#handleOnClickOnDetail()) {
                    this.onKupClick(nativeEvent);
                }
                break;
        }
    }

    handleOnDateChange(nativeEvent: GanttRow) {
        if (this.#emitOnChangeEventsReceived(nativeEvent)) {
            console.log('handleOnDateChange', nativeEvent);
            this.onKupDateChange(nativeEvent);
        }
    }

    componentWillLoad() {
        this.#kupManager.debug.logLoad(this, false);
        this.#kupManager.theme.register(this);
    }

    componentDidLoad() {
        this.plannerProps = {
            mainGantt: {
                title: this.titleMess,
                items: this.#toTasks(this.data),
                stylingOptions: {
                    ...defaultStylingOptions,
                    listCellWidth: this.listCellWidth,
                },
                hideLabel: true,
                showSecondaryDates: this.showSecondaryDates,
                onClick: (nativeEvent: KupPlannerGanttTask | KupPlannerPhase) =>
                    this.handleOnClick(nativeEvent),
                onDateChange: (nativeEvent) =>
                    this.handleOnDateChange(nativeEvent),
            },
            secondaryGantt: this.detailData
                ? {
                      title: '',
                      items: this.#toDetails(this.detailData),
                      stylingOptions: {
                          ...defaultStylingOptions,
                          listCellWidth: this.listCellWidth,
                      },
                      hideLabel: true,
                      onClick: (nativeEvent: KupPlannerDetail) =>
                          this.handleOnClick(nativeEvent),
                      onDateChange: (nativeEvent) =>
                          this.handleOnDateChange(nativeEvent),
                  }
                : undefined,
        };

        this.#renderReactPlannerElement();
        this.kupReady.emit({
            comp: this,
            id: this.rootElement.id,
            value: undefined,
        });
        this.#kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.#renderReactPlannerElement();
    }

    componentDidRender() {
        this.#kupManager.debug.logRender(this, true);
    }

    render() {
        return (
            <Host>
                <div id={componentWrapperId}></div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.#kupManager.theme.unregister(this);
    }
}