
import { TypegenConstraint, TypegenDisabled,  } from 'xstate/lib/typegenTypes';
import { AnyEventObject, BaseActionObject, EventObject, MachineConfig, Typestate, ServiceMap,TransitionsConfig,StateNodeConfig, StatesConfig, StateSchema } from 'xstate/lib/types';
import { NameForGolang } from './go';
import { ResolveTypegenMeta, StateMachine, StateNodesConfig, createMachine } from 'xstate';

interface exportContext {
    isParallel: boolean;
    stateName: string[];
}
interface Event {
    name: string;
    event: EventObject;
}

interface State {
    name: string;
    state: StateNodeConfig<any, StateSchema, EventObject, BaseActionObject>;
}

function getEventFromState(state:State):Event[]{
    const events:Event[] = []
        if(state.state.on){
            Object.entries(state.state.on).map(([key, value]) => {
                events.push({
                    name: NameForGolang(`${state.name}_${key}`),
                    event: value as EventObject
                })
            })
        }

    return events
}

function getAllChildrenStates(state:StateNodesConfig<any, any, AnyEventObject>):State[]{
    const queue:State[] = []
    const states:State[] = []
    Object.entries(state).map(([key, value]) => {
        queue.push({
            name: NameForGolang(key),
            state: value as StateNodeConfig<any, any, EventObject, any>
        })
    })

    while (queue.length > 0) {
        const state = queue.shift()
        if(state){
            states.push(state)
        }
        if(state?.state.states){
            Object.entries(state.state.states).map(([key, value]) => {
                queue.push({
                    name: NameForGolang(`${state.name}_${key}`),
                    state: value as StateNodeConfig<any, any, EventObject, any>
                })
            })
        }
    }
    return states
}

function getStateMachineInfo(state:StateMachine<any, any, AnyEventObject, {
    value: any;
    context: any;
}, BaseActionObject, ServiceMap, ResolveTypegenMeta<TypegenDisabled, AnyEventObject, BaseActionObject, ServiceMap>>):exportContext{
    const context:exportContext = {
        isParallel: false,
        stateName: [
            state.id
        ]
    }
    return context
}

function convertEventTargetName(ctx: exportContext,targetStateName:string):string{
    // spilt targetStateName by .
    const targetStateNames = targetStateName.split('.')
    // remove first 
    targetStateNames.shift()

    return targetStateNames.join('_')
}

export function convert<TContext, TEvent extends EventObject = AnyEventObject, TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
}, TServiceMap extends ServiceMap = ServiceMap, TTypesMeta extends TypegenConstraint = TypegenDisabled>(config:MachineConfig<TContext, any, TEvent, BaseActionObject, TServiceMap, TTypesMeta>):string{

    const fetchMachine = createMachine<any>(config as MachineConfig<any, any, any, any>)

    const context = getStateMachineInfo(fetchMachine)

    const states = getAllChildrenStates(fetchMachine.states)
    const events = fetchMachine.events
    const golangCode = `import "github.com/qmuntal/stateless"

type State string
const (\n ${Object.entries(config.states || {}).map(([key, value]) => `\t${NameForGolang(key)} State = "${key}"`).join('\n')}
    )

type Trigger string
const (\n ${
    events.map((event) => `\t${NameForGolang(event)} Trigger = "${event}"`).join('\n')}
)

func ${NameForGolang(config.id||"")}() *stateless.StateMachine {
	machine := stateless.NewStateMachine(${String(config.initial)})
    
    ${
        states.map((state) => {
        return `machine.Configure(${state.name})${
            state.state.on ? Object.entries(state.state.on).map(([key, value]) => {
                return value?.map((on:any) => {
                    return on.target.map((state:any) => {
                        return `.Permit(${NameForGolang(key)}, ${NameForGolang(convertEventTargetName(context,state.id))})`
                    })
                })
            }).join('\n\t\t') : ''
        }`
    }).join('\n\t')
    }
    
    return machine
}`

    return golangCode;
}
    
    
