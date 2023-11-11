
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
    const states:State[] = []
    Object.entries(config.states || {}).map(([key, value]) => {
        states.push({
            name: key,
            state: value as StateNodeConfig<any, any, EventObject, any>
        })
    })
    return states
}
export function convert<TContext, TEvent extends EventObject = AnyEventObject, TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
}, TServiceMap extends ServiceMap = ServiceMap, TTypesMeta extends TypegenConstraint = TypegenDisabled>(config:MachineConfig<TContext, any, TEvent, BaseActionObject, TServiceMap, TTypesMeta>):string{
    console.log(config);

    const events = getEvent(config as MachineConfig<any, any, any, any>)
    const states = getStates(config as MachineConfig<any, any, any, any>)

    const golangCode = `
import "github.com/qmuntal/stateless"

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
                const event = events.find((event) => event.event === value)
                return `.Permit(${key}, ${event?.event?.target || ''})`
            }).join('\n\t\t') : ''
        }`
    }).join('\n\t')}
    
    return machine
}`

    return golangCode;
}
    
    