
import { TypegenConstraint, TypegenDisabled,  } from 'xstate/lib/typegenTypes';
import { AnyEventObject, BaseActionObject, EventObject, MachineConfig, Typestate, ServiceMap,TransitionsConfig,StateNodeConfig } from 'xstate/lib/types';

interface Event {
    name: string;
    event: EventObject;
}

interface State {
    name: string;
    state: StateNodeConfig<any, any, EventObject, any>;
}

function getEvent(config:MachineConfig<any, any, EventObject, BaseActionObject, any,any>):Event[]{
    const events:Event[] = []
    Object.entries(config.states || {}).map(([key, value]) => {
        if(value.on){
            Object.entries(value.on).map(([key, value]) => {
                events.push({
                    name: key,
                    event: value as EventObject
                })
            })
        }
    })
    return events
}

function getStates(config:MachineConfig<any, any, EventObject, BaseActionObject, any,any>):State[]{
    const queue:State[] = []
    const states:State[] = []
    Object.entries(config.states || {}).map(([key, value]) => {
        queue.push({
            name: key,
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
                    name: `${state.name}_${key}`,
                    state: value as StateNodeConfig<any, any, EventObject, any>
                })
            })
        }
    }
    return states
}

function getSubStates(config:MachineConfig<any, any, EventObject, BaseActionObject, any,any>,stateName:string):State[]{
    const state = config.states?.[stateName]
    const subStates = state?.states
    return Object.entries(subStates || {}).map(([key, value]) => {
        return {
            name: key,
            state: value as StateNodeConfig<any, any, EventObject, any>
        }
    })
}

export function convert<TContext, TEvent extends EventObject = AnyEventObject, TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
}, TServiceMap extends ServiceMap = ServiceMap, TTypesMeta extends TypegenConstraint = TypegenDisabled>(config:MachineConfig<TContext, any, TEvent, BaseActionObject, TServiceMap, TTypesMeta>):string{
    console.log(config);

    const events = getEvent(config as MachineConfig<any, any, any, any>)
    const states = getStates(config as MachineConfig<any, any, any, any>)

    const golangCode = `import "github.com/qmuntal/stateless"

type State string
const (\n ${Object.entries(config.states || {}).map(([key, value]) => `\t${key} State = "${key}"`).join('\n')}
    )

type Trigger string
const (\n ${
    events.map((event) => `\t${event.name} Trigger = "${event.name}"`).join('\n')}
)

func ${config.id}() *stateless.StateMachine {
	machine := stateless.NewStateMachine(${String(config.initial)})
    
    ${states.map((state) => {
        return `machine.Configure(${state.name})${
            state.state.on ? Object.entries(state.state.on).map(([key, value]) => {
                const event = events.find((event) => event.name === key)
                // @ts-ignore
                return `.Permit(${key}, ${event?.event?.target || '未知'})`
            }).join('\n\t\t') : ''
        }`
    }).join('\n\t')}
    
    return machine
}`

    return golangCode;
}
    
    